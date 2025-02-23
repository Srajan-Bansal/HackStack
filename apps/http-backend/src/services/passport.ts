import { z } from 'zod';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import prisma from '@repo/db/client';
import {
	UserSignupSchema,
	UserSchema,
	User,
	OAuthProfile,
} from '@repo/common-zod/types';

const createUser = async (params: {
	email: string;
	name: string | null;
	provider: z.infer<typeof UserSchema.shape.provider>;
	password?: string;
}) => {
	const { email, name, provider, password } = params;

	const finalPassword = provider === 'email' ? password : '';

	if (provider === 'email') {
		UserSignupSchema.parse({ email, password });
	}

	return prisma.user.create({
		data: {
			email,
			name,
			provider,
			password: finalPassword as string,
			role: 'USER',
		},
	});
};

// JWT Strategy
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET as string,
		},
		async (
			payload: { id: string },
			done: (error: any, user?: any) => void
		) => {
			try {
				const user = await prisma.user.findUnique({
					where: { id: payload.id },
				});
				return user ? done(null, user) : done(null, false);
			} catch (error) {
				return done(error, false);
			}
		}
	)
);

// Google OAuth Strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			callbackURL: `/auth/google/callback`,
		},
		async (
			accessToken: string,
			refreshToken: string,
			profile: OAuthProfile,
			done: (error: any, user?: any) => void
		) => {
			try {
				const email = profile.emails?.[0]?.value;
				if (!email) {
					return done(
						new Error('No email provided from Google'),
						null
					);
				}

				let user = await prisma.user.findUnique({
					where: { email },
				});

				if (!user) {
					user = await createUser({
						email,
						name:
							profile.displayName ?? email.split('@')[0] ?? null,
						provider: 'google',
					});
				}

				done(null, user);
			} catch (error) {
				done(error, null);
			}
		}
	)
);

// GitHub OAuth Strategy
passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
			callbackURL: `/auth/github/callback`,
		},
		async (
			accessToken: string,
			refreshToken: string,
			profile: OAuthProfile,
			done: (error: any, user?: any) => void
		) => {
			try {
				const email =
					profile.emails?.[0]?.value ||
					`${profile.username}@github.com`;

				let user = await prisma.user.findUnique({
					where: { email },
				});

				if (!user) {
					user = await createUser({
						email,
						name:
							profile.displayName ?? email.split('@')[0] ?? null,
						provider: 'github',
					});
				}

				done(null, user);
			} catch (error) {
				done(error, null);
			}
		}
	)
);

declare global {
	namespace Express {
		interface User extends z.infer<typeof UserSchema> {}
	}
}

export type { User, OAuthProfile };

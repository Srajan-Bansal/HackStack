# HackStack

HackStack is a coding platform designed to practice algorithmic problems and run code securely using an isolated execution engine.

---

## 📚 Problems Repository

All coding problems used in HackStack are maintained in a separate repository.

🔗 **Problems Repository**  
https://github.com/Srajan-Bansal/hackstack-problems

This repository contains:
- Problem statements
- Input and output specifications
- Test cases
- Difficulty levels
- Tags for categorization

---

## 🏗 Architecture

![HackStack Architecture](https://github.com/user-attachments/assets/dd3ec65c-3dff-43ee-adce-235de062ab6a)

HackStack follows a modular architecture where the main application and the code execution engine are separated for better scalability and security.

---

## ⚙️ Execution Engine

Code execution in HackStack is handled by a separate service called **OpenExecutor**.

OpenExecutor is a sandboxed code execution engine responsible for:

- Compiling and running user submissions
- Isolating execution environments for security
- Processing test cases
- Returning execution results back to the HackStack server

🔗 **OpenExecutor GitHub Repository**  
https://github.com/Srajan-Bansal/OpenExecutor

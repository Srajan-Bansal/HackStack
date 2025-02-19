// Copyright: 2023 Petroit
; (function (context, formBuilder) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define(function (require, exports, module) {
            var formBuilderAudit = require("formBuilderAudit");
            var validations = require("validations");
            var dragDropTouch = require("uiTouch");
            return context.formBuilder = formBuilder(formBuilderAudit, validations, dragDropTouch);
        });
    } else {
        alert('Include Require JS.');
    }

}(this, function (formBuilderAudit, validations, dragDropTouch) {
    "use strict";
    // var $ = $;
    var formBuilder = {};

    formBuilder = function (divId) {
        this.controlId = divId;
        this.definitionList = [];
        this.product = "";
        this.module = "";
        this.template_id = '';
        this.definition = {};
        this.callbacks = { saveTemplateCallBack: null, backTemplateCallBack: null, validation: null };
        this.templateData = {};
        this.statusData = [];
        this.templateList = [];
        this.lovList = [];
        this.statusList = [];
        this.userGroupData = {};
        this.querySetList = [];
        this.selectedUserGroup = [];
        this.selectEmailGroup = [];
        this.selectedDataStatus = [];
        this.selectedStages = [];
        this.selectedUserGroupForm = [];
        this.finalStatus = [];
        this.selectedFieldLevelPermission = [];
        this.selectedAttributesList = [];
        this.selectedGridAttributeList = [];
        this.msgList = [];
        this.dropdownServiceUrl = [];
        this.dropDownFormList = [];
        this.host = {};
        this.next_seq = {};
        this.objects = {};
        this.metaData = {};
        this.theme = "";
        this.dev_options = {};
        this.version = 0;
        this.isClone = false;
        this.template_key = "";
        this.setting = { formControls: [], actionTemplateControls: [], businessEventList: [] };
        this.resultData = [];
        this.mandatory_columns = {};
        this.cloneTemplateName = "";
        this.isEmailTemplate = true;
        this.emailTemplateList = [];
        this.feature_id = "";
        this.objects = {};
        this.matrixData = {};
        this.selectedDisplayColumn = [];
        this.selectedFormList = [];
    }

    formBuilder.prototype.setProduct = function (product) {
        this.product = product;
        return this;
    }

    formBuilder.prototype.setListDefinition = function (listDefinition) {
        this.definitionList = listDefinition;
        return this;
    }

    formBuilder.prototype.setHost = function (host) {
        this.host = host;
        return this;
    }

    formBuilder.prototype.setIsClone = function (isClone) {
        this.isClone = isClone;
        return this;
    }

    formBuilder.prototype.setCloneTemplateName = function (cloneTemplateName) {
        this.cloneTemplateName = cloneTemplateName;
        return this;
    }

    formBuilder.prototype.setModule = function (module) {
        this.module = module;
        return this;
    }

    formBuilder.prototype.setTheme = function (theme) {
        this.theme = theme;
        return this;
    }

    formBuilder.prototype.setFormControls = function (formControls) {
        this.setting.formControls = formControls;
        return this;
    }

    formBuilder.prototype.setTemplateId = function (template_id) {
        this.template_id = template_id;
        return this;
    }
    formBuilder.prototype.setMetaData = function (metaData) {
        this.metaData = metaData;
        return this;
    }

    formBuilder.prototype.setTemplateName = function (template_name) {
        this.template_name = template_name;
        return this;
    }

    formBuilder.prototype.setTemplateKey = function (template_key) {
        this.template_key = template_key;
        return this;
    }

    formBuilder.prototype.setFeatureId = function (feature_id) {
        this.feature_id = feature_id;
        return this;
    }

    formBuilder.prototype.getComponent = function (id) {
        return this.filter(this.definitionList, { id: id })[0];
    }


    formBuilder.prototype.setQuerySet = function (querySetList) {
        this.querySetList = querySetList;
        return this;
    }

    formBuilder.prototype.setDropdownServiceUrl = function (dropdownServiceUrl) {
        this.dropdownServiceUrl = dropdownServiceUrl;
        return this;
    }

    formBuilder.prototype.setActionTemplateControls = function (actionTemplateControls) {
        this.setting.actionTemplateControls = actionTemplateControls;
        return this;
    }

    formBuilder.prototype.setBusinessEventList = function (businessEventList) {
        this.setting.businessEventList = businessEventList;
        return this;
    }

    formBuilder.prototype.setCallbacks = function (callback) {
        this.callbacks = formBuilder.replaceKeys(this.callbacks, callback);
    }

    formBuilder.prototype.setEmailTemplate = function (isEmailTemplate) {
        this.isEmailTemplate = isEmailTemplate;
        return this;
    }

    formBuilder.replaceKeys = function (source, target) {
        if (target == undefined) {
            return source;
        }
        $.each(source, function (key, value) {
            if (!target.hasOwnProperty(key)) {
                target[key] = value;
            }
        });
        return target;
    }


    formBuilder.prototype.bind = function () {
        var context = this;
        context.createLoader();
        context.createViewWrapper();
        context.createMsgContainer();
        context.getTemplateMetadata();
        if (context.isEmailTemplate) {
            context.setEmailTemplateData();
        }
    }

    formBuilder.prototype.replaceKeys = function (source, target) {
        if (target == undefined) {
            return source;
        }
        $.each(source, function (key, value) {
            if (!target.hasOwnProperty(key)) {
                target[key] = value;
            }
        });
        return target;
    }


    formBuilder.prototype.getId = function (id) {
        var context = this;
        return context.controlId + '_' + id;
    }

    formBuilder.prototype.createContainer = function () {
        var context = this;
        var $container = $('<div>', {
            class: 'dragable-form-wrapper lib-template-form platform-wrapper lib-form-container ' + context.theme
        });

        var $formBuilderContainer = $('<div>', {
            id: context.getId('formBuilder_container'),
            class: 'bg-shadow lib-dynamic-form-container'
        });

        var $headerSection = $('<div>', {
            class: 'lib-columns lib-col-gapless lib-align-items-end lib-flex-fill lib-custom-size'
        }).append(context.headerSection());

        var $formColumns = $('<div>', {
            class: 'lib-columns lib-col-gapless'
        }).append(
            context.getAttributeContainer(),
            context.getDefinitionContainer(),
            context.getPropertyContainer(),
        );

        $formBuilderContainer.append($headerSection, $formColumns);
        $container.append($formBuilderContainer, context.getPreviewContainer());

        $("#" + context.controlId).append($container);
        $("#" + context.controlId).append(context.createModelBox());
        $("#" + context.controlId).append(context.createValidationModelBox());
    }
    formBuilder.prototype.createLoader = function () {
        var context = this;
        var str = '<div style="display: none;" class="lib-loader-wrapper" id="' + context.getId("loader") + '"><div class="lib-loader"></div></div>';
        $("#" + context.controlId).append(str);
    }

    formBuilder.prototype.createViewWrapper = function () {
        var context = this;
        var str = '<div style="display: none;" class=" " id="' + context.getId("viewDetails") + '"></div>';
        $("#" + context.controlId).append(str);
    }

    formBuilder.prototype.createModelBox = function () {
        var context = this;
        var modalBoxId = context.getId('modalBox');
        var btnCloseId = context.getId('btnClose');
        var modalTitleId = context.getId('modalTitle');
        var modalContentId = context.getId('modalcontent');
        var modalFooterId = context.getId('modalFooter');

        $('<div>', {
            class: "lib-modal lib-modal-sm " + context.theme,
            id: modalBoxId
        }).append(
            $('<div>', {
                class: "lib-modal-overlay"
            }),
            $('<div>', {
                class: "lib-modal-lib-container platform-popup"
            }).append(
                $('<div>', {
                    class: "lib-modal-header"
                }).append(
                    $('<button>', {
                        class: "lib-btn lib-btn-clear float-right close-modal",
                        type: "button",
                        id: btnCloseId
                    }),
                    $('<div>', {
                        class: "lib-modal-title h5",
                        id: modalTitleId
                    })
                ),
                $('<div>', {
                    class: "lib-modal-body lib-popup-overflow-auto custom-scrollbar"
                }).append(
                    $('<div>', {
                        class: "lib-content",
                        id: modalContentId
                    })
                ),
                $('<div>', {
                    class: "lib-modal-footer",
                    id: modalFooterId
                })
            )
        ).appendTo('#' + context.controlId);


        $('#' + btnCloseId).unbind('click').bind('click', function () {
            context.modal(0);
        });
    }

    formBuilder.prototype.modal = function (mode) {
        var context = this;
        var modalBoxId = '#' + context.getId('modalBox');
        var modalTitleId = '#' + context.getId('modalTitle');
        var modalContentId = '#' + context.getId('modalcontent');
        var modalFooterId = '#' + context.getId('modalFooter');

        if (mode == 1) {
            $(modalBoxId).addClass('active');
            $("body").addClass('modal-open-scroll-none');
        } else {
            $(modalBoxId).removeClass('lib-modal-md lib-modal-lg lib-modal-xl active');
            $(modalContentId).removeClass('screen-min-height-30');
            $(modalTitleId).empty();
            $(modalContentId).empty();
            $(modalFooterId).empty();
            $("body").removeClass('modal-open-scroll-none');
        }
    }

    formBuilder.prototype.createValidationModelBox = function () {
        var context = this;
        var modalBoxId = context.getId('modalValidationBox');
        var btnCloseId = context.getId('btnValidationClose');
        var modalTitleId = context.getId('modalValidationTitle');
        var modalContentId = context.getId('modalValidationContent');
        var modalFooterId = context.getId('modalValidationFooter');

        $('<div>', {
            class: "lib-modal lib-modal-sm " + context.theme,
            id: modalBoxId
        }).append(
            $('<div>', {
                class: "lib-modal-overlay"
            }),
            $('<div>', {
                class: "lib-modal-lib-container platform-popup"
            }).append(
                $('<div>', {
                    class: "lib-modal-header"
                }).append(
                    $('<button>', {
                        class: "lib-btn lib-btn-clear float-right close-modal",
                        type: "button",
                        id: btnCloseId
                    }),
                    $('<div>', {
                        class: "lib-modal-title h5",
                        id: modalTitleId
                    })
                ),
                $('<div>', {
                    class: "lib-modal-body lib-popup-overflow-auto custom-scrollbar"
                }).append(
                    $('<div>', {
                        class: "lib-content",
                        id: modalContentId
                    })
                ),
                $('<div>', {
                    class: "lib-modal-footer",
                    id: modalFooterId
                })
            )
        ).appendTo('#' + context.controlId);


        $('#' + btnCloseId).unbind('click').bind('click', function () {
            context.modalValidation(0);
        });
    }

    formBuilder.prototype.modalValidation = function (mode) {
        var context = this;
        var modalBoxId = '#' + context.getId('modalValidationBox');
        var modalTitleId = '#' + context.getId('modalValidationTitle');
        var modalContentId = '#' + context.getId('modalValidationContent');
        var modalFooterId = '#' + context.getId('modalValidationFooter');

        if (mode == 1) {
            $(modalBoxId).addClass('active');
            $("body").addClass('modal-open-scroll-none');
        } else {
            $(modalBoxId).removeClass('lib-modal-lg lib-modal-xl active');
            $(modalContentId).removeClass('screen-min-height-30');
            $(modalTitleId).empty();
            $(modalContentId).empty();
            $(modalFooterId).empty();
            $("body").removeClass('modal-open-scroll-none');
        }
    }

    formBuilder.prototype.setEmailTemplateList = function () {
        var context = this;
        context.getApiData(context.host.notification + 'api/EmailTemplate/GetEmailTemplateById?id=' + context.metaData.projectId, function (data) {
            context.emailTemplateList = data;
        });
    }
    formBuilder.prototype.getStatusList = function () {
        var context = this;
        context.toggleLoader(1);
        context.getApiData(context.host.anarServiceUrl + 'api/getAllStatus' + "/" + context.metaData.projectId, function (result) {
            context.toggleLoader(0);
            context.statusList = result.data;
            context.setStatusLi(result.data);
            context.deleteStatusList();
            context.editStatusList();
            context.editUpdateStatusList();
            context.closeStatusList();
            context.bindDataStatus();
            context.bindState('ddlNextState');
        });
    }

    formBuilder.prototype.deleteStatusList = function () {
        var context = this;
        $("#" + context.getId('ulIntState')).find(".lib-delete-icon").unbind("click").bind("click", function () {
            var deleteId = $(this).attr("statusId");
            context.deleteStatusApi(deleteId);
            context.getStatusList();
        });

    }
    formBuilder.prototype.setEmailTemplateData = function () {
        var context = this;
        context.getApiData(context.host.anarServiceUrl + 'api/templatedata/' + context.metaData.projectId, function (data) {
            var result = data.data;
            context.emailTemplateList = result;
        });
    }

    formBuilder.prototype.setStatusLi = function (statusList) {
        var context = this;
        var ulId = $("#" + context.getId('ulIntState'));
        ulId.empty();
        for (var i = 0; i < statusList.length; i++) {
            if (statusList[i].statusName) {
                $('<li>', {
                    class: 'lib-data-action-list',
                    id: statusList[i].id + "li",
                }).append(
                    $('<div>', { class: 'lib-display-flex' }).append(
                        $('<div>', { class: 'lib-col-6' }).append(
                            $('<div>', { class: 'lib-form-label', text: statusList[i].statusName }))).append(
                                $('<div>', { class: 'lib-col-5 ml-2' }).append(
                                    $('<div>', { class: 'lib-form-label' }).append($('<span>', { class: 'lib-edit-icon' }).attr("abbreviationName", statusList[i].abbreviation).text(context.filter(context.getStateType(), { id: statusList[i].abbreviation })[0]?.value)))),
                    $('<div>', { class: 'lib-action-icon' }).append(
                        $('<span>', { class: 'lib-edit-icon' }).attr("statusName", statusList[i].statusName).attr("statusId", statusList[i].id).attr("id", statusList[i].id + "_edit").append($('<i>', { class: 'fa fa-pencil' })),
                        $('<span>', { class: 'lib-delete-icon' }).attr("statusName", statusList[i].statusName).attr("statusId", statusList[i].id).attr("id", statusList[i].id + "_delete").append($('<i>', { class: 'fa fa-trash' }))
                    )
                ).appendTo(ulId);
            }
        }
        $("#" + context.getId("addNewIntStateBtn")).unbind("click").bind("click", function () {
            context.saveStatusApi();
        });
    }

    formBuilder.prototype.openListOfValuePopupModal = function (lovId) {
        var context = this;
        context.modal(1);
        $("#" + context.getId('modalBox')).addClass("lib-modal-lg");
        $("#" + context.getId('modalTitle')).append(_common.getLocalizedValue('LBL_ADD/EDIT_LOV'));
        $("#" + context.getId('modalcontent')).append(context.createLovContainer(lovId));
        $("#" + context.getId('modalFooter')).append('');
    }

    formBuilder.prototype.createLovContainer = function (lovId) {
        var context = this;
        var objLov = new lov(context.getId('modalcontent'));
        objLov.setHost(context.host);
        objLov.setProduct(context.product);
        objLov.setMetaData(context.metaData);
        objLov.setLovId(lovId);
        objLov.setCallbacks({ saveLovCallBack: function (lovId) { context.lovSaved(context, lovId) }, deleteLovCallback: function (lovId) { context.deleteLov(context, lovId) } });
        objLov.bind();
    }

    formBuilder.prototype.lovSaved = function (context, id) {
        context.getLovList(id);
    }

    formBuilder.prototype.deleteLov = function (context, id) {
        context.getLovList(id);
    }

    formBuilder.prototype.openTemplatePopupModal = function () {
        var context = this;
        context.modal(0);
        context.modal(1);
        $("#" + context.getId('modalBox')).addClass("lib-modal-xl");
        $("#" + context.getId('modalTitle')).append(_common.getLocalizedValue('LBL_ADD/EDIT_TEMPLATE'));
        $("#" + context.getId('modalcontent'));
        $("#" + context.getId('modalFooter'));
    }

    formBuilder.prototype.bindTemplateForm = function () {
        var context = this;
        var template_id = $("#" + context.getId("templateList")).find(":selected").val();
        context.openTemplatePopupModal();
        var addTemplate = new formBuilder(context.getId('modalcontent'));
        addTemplate.setProduct(context.product);
        addTemplate.setTheme(context.theme);
        addTemplate.setMetaData(context.metaData);
        addTemplate.setQuerySet(context.querySetList);
        addTemplate.setModule(context.module);
        addTemplate.setFormControls(context.setting.formControls)
        if (template_id) {
            addTemplate.setTemplateId(template_id);
        }
        addTemplate.setCallbacks({ saveTemplateCallBack: function (template_id) { context.saveAddedTemplate(context, template_id) }, backTemplateCallBack: function () { context.backAddedTemplate(context) } });
        addTemplate.setHost(context.host);
        addTemplate.bind();

    }

    formBuilder.prototype.backAddedTemplate = function () {
        var context = this;
        context.modal(0);
    }

    formBuilder.prototype.saveAddedTemplate = function (context, template_id) {
        context.modal(0);
        context.getTemplateList(template_id);
    }
    formBuilder.prototype.getTemplateList = function (template_id) {
        var context = this;
        context.toggleLoader(1);
        context.getApiData(context.host.anarServiceUrl + 'api/gettemplatelistwithoutactions/' + context.metaData.projectId + '/' + context.module, function (result) {
            context.toggleLoader(0);
            context.templateList = result.data;
            context.bindTemplateListInAction();
            $("#" + context.getId("templateList")).val(template_id).trigger('click');
            context.savePropertyData();
        });
    }

    formBuilder.prototype.openFullScreenPopupModal = function () {
        var context = this;
        context.modal(1);
        $("#" + context.getId('modalBox')).addClass("lib-modal-lg");
        $("#" + context.getId('modalTitle')).append(_common.getLocalizedValue('LBL_ADD/EDIT_STATUS'));
        $("#" + context.getId('modalcontent')).append(context.createFormGridContainer());
        $("#" + context.getId('modalFooter'));
        context.bindStateType();
    }

    formBuilder.prototype.createFormGridContainer = function () {
        var context = this;
        var formGrid = $('<div>', {
            class: 'lib-form-group',
        });

        var rowLabel = $('<div>', {
            class: 'mt-2 mb-3 lib-border-gray p-3',
        }).appendTo(formGrid);

        var flexDiv = $('<div>', {
            class: 'lib-display-flex',
        }).appendTo(rowLabel);

        var divCol = $('<div>', {
            class: 'lib-col-6',
        }).appendTo(flexDiv);

        var divCol6 = $('<div>', {
            class: 'lib-col-6 ml-2',
        }).appendTo(flexDiv);

        $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_ABBREVIATION')
        }).appendTo(divCol6);
        $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_STATUS')
        }).appendTo(divCol);

        $('<input>', {
            class: 'lib-form-control lib-separate-btn',
            id: context.getId('addNewInitialState'),
            autoComplete: 'off',
        }).appendTo(divCol);

        var divIntState = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative',
        }).appendTo(divCol6);

        var dropdown = $('<select>', {
            class: 'lib-form-control',
            id: context.getId('addNewAbbreviation'),
            autoComplete: 'off',
        }).appendTo(divIntState);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon lib-position-relative lib-height-auto ml-1',
            type: "button",
            id: context.getId('addNewIntStateBtn'),
            title: _common.getLocalizedValue('LBL_ADD')
        }).append($('<i>', {
            class: "fa fa-plus",
        })).appendTo(divIntState);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon lib-position-relative lib-height-auto ml-1',
            type: "button",
            id: context.getId('checkEditBtn'),
            title: "Update",
            style: "display:none"
        }).append($('<i>', {
            id: context.statusList.id,
            class: "fa fa-check",
        })).appendTo(divIntState);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon lib-position-relative lib-height-auto ml-1',
            type: "button",
            id: context.getId('closeBtn'),
            title: "Close",
            style: "display:none"
        }).append($('<i>', {
            class: "fa fa-times",
        })).appendTo(divIntState);

        var grid = $('<div>', {
            class: 'mt-2',
            id: context.getId('bindIntStateGrid'),
        }).appendTo(rowLabel);

        var list = $('<ul>', {
            class: 'lib-edit-list-attr custom-scrollbar',
            id: context.getId('ulIntState')
        }).appendTo(grid);



        return formGrid;
    }
    formBuilder.prototype.openPopupModal = function () {
        var context = this;
        context.modal(1);
        $("#" + context.getId('modalTitle'))
            .append("Title");

        var editDiv = $('<div>', {
            class: 'lib-display-flex',
            id: context.getId('editDiv')
        });

        $('<label>', {
            class: 'lib-form-label lib-display-flex mr-3',
            for: context.getId("libForm")
        }).appendTo(editDiv).append(
            $('<input>', {
                class: "mr-1",
                type: "radio",
                id: context.getId("libForm"),
                name: "radio"
            }),
            $('<span>', {
                text: _common.getLocalizedValue('LBL_FORM')
            })
        );

        $('<label>', {
            class: 'lib-form-label lib-display-flex mr-3',
            for: context.getId("libFormSource")
        }).appendTo(editDiv).append(
            $('<input>', {
                class: "mr-1",
                type: "radio",
                id: context.getId("libFormSource"),
                name: "radio"
            }),
            $('<span>', {
                text: "Form Source"
            })
        );

        var editTabs = $('<div>', {
            class: 'lib-form-rend-column mb-2',
            id: context.getId('editTabs')
        });

        $('<div>', {
            id: context.getId('tabs')
        }).appendTo(editTabs);

        var modalContent = $('<div>', {
            class: 'lib-form-rend-column mb-2',
        });
        modalContent.append(editDiv);

        $("#" + context.getId('modalcontent'))
            .append(modalContent)
            .append(editTabs);

        var btnSaveForm = $('<button>', {
            id: context.getId("btnSaveForm"),
            type: "button",
            class: "lib-btn-custom",
            text: "Save"
        });

        var btnCancelForm = $('<button>', {
            id: context.getId("btnCancelForm"),
            type: "button",
            class: "lib-btn-custom",
            text: "Cancel"
        });

        var modalFooter = $('<div>', {
            class: "custom-grid-modal-footer text-center",
        });

        modalFooter.append(btnSaveForm);
        modalFooter.append(btnCancelForm);

        $("#" + context.getId('modalFooter')).append(modalFooter);
        context.createTabContainer();

        $("#" + context.getId("libTabs")).tabs();
    }

    formBuilder.prototype.bindFileAfterUpload = function (id, fileName, idSize) {
        var context = this;
        $("#" + id + "list").append($("<li>").append('<label class="form-checkbox attr-lbl without-checkbox"><a class ="attachmentdownload "><span class="icon-link">' + fileName + '</span></a></label><span class="list-delete-trigger attachmentdelete cross" data=' + fileName + '><i class="fa fa-times"></i></span>').attr('data-id', idSize));
        $("#" + id).attr('placeholder', 'No File Chosen').val("").focus().blur();
        context.toggleLoader(0);
    }

    formBuilder.prototype.divFile = function (id, name) {
        var context = this;
        if (!name) {
            name = "";
        } else {
            $("#" + id + "_div").append($("<ul>").addClass("attr-listing file-list-template custom-scrollbar").attr("id", context.getId(id + "Ul")).append($("<li>").attr("id", id + "_uploadedFile").append('<label class="form-checkbox attr-lbl without-checkbox"><a class="attachmentdownload"><span class="icon-link" id ="' + context.getId("file") + '">' + name + '</span></a></label>').append($('<span>').addClass("list-delete-trigger").attr("data-attr", "3").append('<i class="fa fa-times" aria-hidden="true"></i>').on("click", function () {
                $(this).closest("li").remove();
                context.savePropertyData();
            }))));
        }
    }

    formBuilder.prototype.uploadFile = function (id) {
        var context = this;
        var currentComponent = context.getComponent(context.componentId);
        var spanFile = $(context.getId('file'));
        var file = $("#" + id).prop('files');
        if (currentComponent.subType == "formTitle") {
            if (file && file[0].size < 4000000) {
                context.processFileUploadAfterUpload(file[0], id);

            } else {
                context.msgList.push("Image size exceeded 4MB");
                context.bindMessage('WARNING');
                $("#" + id).val('');
            }
        }
    }


    formBuilder.prototype.processFileUploadAfterUpload = function (file, id) {
        var context = this;
        context.toggleLoader(1);
        var fileName = file.name;
        var postData = {
            "projectId": context.metaData.projectId,
            "fileName": fileName
        };
        formBuilder.post(context.host.clientUrl + "uploaddocurl", postData, function (result) {
            if (result.data?.errorList && result.data.errorList.length > 0) {
                context.msgList.push(result.data.errorList[0]);
                context.bindMessage('WARNING');
                $("#" + id).val('');
            } else {
                var fileId = result.data.fileId;
                var uploadUrl = result.data.uploadUrl;
                $.ajax({
                    type: 'PUT',
                    url: result.data.uploadUrl,
                    contentType: 'application/octet-stream',
                    processData: false,
                    data: file,
                    xhrFields: {
                        withCredentials: false
                    },
                    success: function (response) {
                        $("#" + id + "_div").empty();
                        $("#" + id).text(fileId);
                        $("#" + id).attr('title', fileId);
                        context.divFile(id, fileId);
                        $("#" + id).attr('placeholder', 'No File Chosen').val("").focus().blur();
                        context.savePropertyData();
                        context.toggleLoader(0);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (XMLHttpRequest.status == 401 || XMLHttpRequest.status == 403) {
                            logout();
                        }
                    }
                });
            }
        }, function () {
        });


    }

    formBuilder.prototype.bindPropertyCalculatedFieldRadio = function () {
        var context = this;
        var radioContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });

        var radioDivCover = $('<div>', {
            class: 'lib-display-flex',
            id: context.getId('calculatedRadioBtnDiv')
        }).appendTo(radioContainer);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex pl-0'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "calculatedDataSource",
            value: "NUMBER",
            id: context.getId('numberBtnRadio')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_NUMBER'),
        })).appendTo(radioDivCover);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "calculatedDataSource",
            value: "STRING",
            id: context.getId('stringBtnRadio')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_STRING')
        })).appendTo(radioDivCover);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "calculatedDataSource",
            value: "DISTANCE",
            id: context.getId('distanceBtnRadio')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_DISTANCE')
        })).appendTo(radioDivCover);

        return radioContainer;
    }

    formBuilder.prototype.bindPropertyNumberFormulaBuilder = function () {
        var context = this;
        var dropDownNumberContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('formulaBuilderNumberDiv'),
            style: 'display:none;'
        });

        $('<label>', {
            class: 'lib-form-label  lib-prop-title',
            text: _common.getLocalizedValue('LBL_FORMULA_BUILDER')
        }).appendTo(dropDownNumberContainer);

        var selectNumberContainer = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative mb-3'
        }).appendTo(dropDownNumberContainer);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('selectNumberFields')
        }).appendTo(selectNumberContainer);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon clickable',
            type: 'button',
            id: context.getId('selectNumberAddBtn')
        }).append('<i class="fa fa-plus"></i>').appendTo(selectNumberContainer);

        $('<label>', {
            class: 'lib-form-label lib-prop-title',
            text: _common.getLocalizedValue('LBL_TEXT_FIELD')
        }).appendTo(dropDownNumberContainer);

        var textNumberContainer = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative mb-3'
        }).appendTo(dropDownNumberContainer);

        $('<input>', {
            class: 'lib-form-control',
            id: context.getId('inputNumberField'),
            autoComplete: 'off'
        }).appendTo(textNumberContainer);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon clickable',
            type: 'button',
            id: context.getId('numberInputAddBtn')
        }).append('<i class="fa fa-plus"></i>').appendTo(textNumberContainer);

        $('<label>', {
            class: 'lib-form-label lib-prop-title',
            text: _common.getLocalizedValue('LBL_OPERATOR_LIST')
        }).appendTo(dropDownNumberContainer);

        var spanNumberContainer = $('<div>', {
            class: 'lib-display-flex p-2 border lib-text-color-blue mb-3',
            id: context.getId('spanNumberDiv')
        }).appendTo(dropDownNumberContainer);

        var characters = ['+', '-', '*', '/', '(', ')'];
        characters.forEach(function (char, index) {
            $('<span>', {
                id: context.getId('span' + (index + 1)),
                class: 'lib-btn-symbol mr-3 clickable',
                text: char
            }).appendTo(spanNumberContainer);
        });

        $('<label>', {
            class: 'lib-form-label lib-prop-title mandatory-star-red-after',
            text: _common.getLocalizedValue('LBL_FINAL_EXPRESSION')
        }).appendTo(dropDownNumberContainer);

        var displayNumberDiv = $('<div>', {
            class: 'lib-display-flex p-2 border'
        }).appendTo(dropDownNumberContainer);

        $('<div>', {
            id: context.getId('formulaNumberDisplay')
        }).appendTo(displayNumberDiv);

        var displayNumberBtnDiv = $('<div>', {
            class: 'ms-auto border-start pl-2 lib-text-center lib-min-w-80px'
        }).appendTo(displayNumberDiv);

        $('<span>', {
            class: 'clickable lib-text-color-blue lib-display-block lib-cursor-pointer mb-2',
            id: context.getId('spanNumberClear'),
            text: _common.getLocalizedValue('LBL_CLEAR')
        }).appendTo(displayNumberBtnDiv);

        $('<span>', {
            class: 'lib-text-color-blue clickable lib-display-block lib-cursor-pointer',
            id: context.getId('numberBackBtn'),
            text: _common.getLocalizedValue('LBL_UNDO')
        }).appendTo(displayNumberBtnDiv);

        return dropDownNumberContainer;
    }

    formBuilder.prototype.bindPropertyDistance = function () {
        var context = this;
        var dropDownNumberContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('calculatedDistanceDiv'),
            style: 'display:none;'
        });

        $('<label>', {
            class: 'lib-form-label  lib-prop-title mandatory-star-red-after',
            text: _common.getLocalizedValue('LBL_FROM_DISTANCE')
        }).appendTo(dropDownNumberContainer);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('selectFormDistance')
        }).appendTo(dropDownNumberContainer);

        $('<label>', {
            class: 'lib-form-label  lib-prop-title mandatory-star-red-after',
            text: _common.getLocalizedValue('LBL_TO_DISTANCE')
        }).appendTo(dropDownNumberContainer);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('selectToDistance')
        }).appendTo(dropDownNumberContainer);

        var radioDivCover = $('<div>', {
            class: 'lib-display-flex',
            id: context.getId('lengthDimension')
        }).appendTo(dropDownNumberContainer);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex pl-0'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "lengthDimension",
            value: "2D_LENGTH",
            checked: true,
            id: context.getId('twoDimensionBtnRadio')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_2D_LENGTH'),
        })).appendTo(radioDivCover);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "lengthDimension",
            value: "3D_LENGTH",
            id: context.getId('threeDimensionBtnRadio')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_3D_LENGTH')
        })).appendTo(radioDivCover);

        $('<label>', {
            class: 'lib-form-label lib-prop-title',
            style: 'display:none;',
            text: _common.getLocalizedValue('LBL_MEASUREMENT_UNIT')
        }).appendTo(dropDownNumberContainer);

        var selectElement = $('<select>', {
            class: 'lib-form-control',
            style: 'display:none;',
            id: context.getId('selectMeasurementUnit')
        }).appendTo(dropDownNumberContainer);

        var measurementUnits = ['cm', 'inch', 'mm', 'ft', 'yard', 'm', 'km'];

        measurementUnits.forEach(unit => {
            $('<option>', {
                value: unit,
                text: unit
            }).appendTo(selectElement);
        });
        return dropDownNumberContainer;
    }

    formBuilder.prototype.bindPropertyNumberAndDecimalExpression = function () {
        var context = this;
        var dropDownNumberContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('formulaBuilderNumberDiv'),
            style: 'display:none;'
        });
        $('<label>', {
            class: 'lib-form-label  lib-prop-title',
            text: _common.getLocalizedValue('LBL_FORMULA_BUILDER')
        }).appendTo(dropDownNumberContainer);

        var selectNumberContainer = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative  mb-3'
        }).appendTo(dropDownNumberContainer);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('selectNumberFields')
        }).appendTo(selectNumberContainer);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon clickable',
            type: 'button',
            id: context.getId('selectNumberAddBtn')
        }).append('<i class="fa fa-plus"></i>').appendTo(selectNumberContainer);

        $('<label>', {
            class: 'lib-form-label lib-prop-title',
            text: _common.getLocalizedValue('LBL_TEXT_FIELD')
        }).appendTo(dropDownNumberContainer);

        var textNumberContainer = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative mb-3'
        }).appendTo(dropDownNumberContainer);

        $('<input>', {
            class: 'lib-form-control',
            id: context.getId('inputNumberField'),
            autoComplete: 'off'
        }).appendTo(textNumberContainer);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon clickable',
            type: 'button',
            id: context.getId('textNumberAddBtn')
        }).append('<i class="fa fa-plus"></i>').appendTo(textNumberContainer);

        $('<label>', {
            class: 'lib-form-label lib-prop-title',
            text: _common.getLocalizedValue('LBL_OPERATOR_LIST')
        }).appendTo(dropDownNumberContainer);

        var selectionNumberContainer = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative  mb-3'
        }).appendTo(dropDownNumberContainer);

        var optionNumberContainer = $('<select>', {
            class: 'lib-form-control',
            id: context.getId('spanNumberDiv')
        }).appendTo(selectionNumberContainer);

        $('<option>', {
            value: '',
            text: '',
            selected: true
        }).appendTo(optionNumberContainer);

        var characters = ['If', 'Else', 'Then', 'And', 'Or', 'Not', 'Equal To', 'Not Equal To', 'Greater Than', 'Less Than', 'Greater Than Equal To', 'Less Than Equal To', 'Between'];
        characters.forEach(function (char, index) {
            $('<option>', {
                id: context.getId('operator' + (index + 1)),
                value: char,
                text: char
            }).appendTo(optionNumberContainer);
        });

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon clickable',
            type: 'button',
            id: context.getId('operatorNumberAddBtn')
        }).append('<i class="fa fa-plus"></i>').appendTo(selectionNumberContainer);

        $('<label>', {
            class: 'lib-form-label lib-prop-title mandatory-star-red-after',
            text: _common.getLocalizedValue('LBL_FINAL_EXPRESSION')
        }).appendTo(dropDownNumberContainer);

        var displayNumberDiv = $('<div>', {
            class: 'lib-display-flex p-2 border mb-3'
        }).appendTo(dropDownNumberContainer);

        $('<div>', {
            id: context.getId('formulaNumberDisplay')
        }).appendTo(displayNumberDiv);

        var displayNumberBtnDiv = $('<div>', {
            class: 'ms-auto border-start pl-2 lib-text-center lib-min-w-80px'
        }).appendTo(displayNumberDiv);

        $('<span>', {
            class: 'clickable lib-text-color-blue lib-display-block lib-cursor-pointer mb-2',
            id: context.getId('numberBtnClear'),
            text: _common.getLocalizedValue('LBL_CLEAR')
        }).appendTo(displayNumberBtnDiv);

        $('<span>', {
            class: 'lib-text-color-blue clickable lib-display-block lib-cursor-pointer',
            id: context.getId('numberBackBtn'),
            text: _common.getLocalizedValue('LBL_UNDO')
        }).appendTo(displayNumberBtnDiv);

        var expressionLabel = $('<div>', {
            class: 'lib-form-group no-change-class mb-3'
        }).appendTo(dropDownNumberContainer);

        var expressionDisplaySpan = $('<span>', {
            class: '',
        }).appendTo(expressionLabel);

        $('<small>', {
            class: 'lib-text-normal',
            id: context.getId("expressionLabel"),
            text: ''
        }).appendTo(expressionDisplaySpan);

        $('<label>', {
            class: 'lib-form-label lib-prop-title mandatory-star-red-after',
            text: _common.getLocalizedValue('LBL_ERROR_MESSAGE')
        }).appendTo(dropDownNumberContainer);

        var errMsgNumberContainer = $('<div>', {
            class: 'lib-input-group mb-3'
        }).appendTo(dropDownNumberContainer);

        $('<input>', {
            class: 'lib-form-control',
            type: 'text',
            id: context.getId('errorInputField'),
            autoComplete: 'off'
        }).appendTo(errMsgNumberContainer);

        return dropDownNumberContainer;
    }

    formBuilder.prototype.bindPropertyStringFormulaBuilder = function () {
        var context = this;
        var dropDownStringContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('formulaBuilderStringDiv'),
            style: 'display:none;'
        });
        $('<label>', {
            class: 'lib-form-label  lib-prop-title',
            text: _common.getLocalizedValue('LBL_FORMULA_BUILDER')
        }).appendTo(dropDownStringContainer);

        var selectStringContainer = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative mb-3'
        }).appendTo(dropDownStringContainer);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('selectStringFields')
        }).appendTo(selectStringContainer);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon clickable ',
            type: 'button',
            id: context.getId('selectStringAddBtn')
        }).append('<i class="fa fa-plus"></i>').appendTo(selectStringContainer);

        $('<label>', {
            class: 'lib-form-label  lib-prop-title',
            text: _common.getLocalizedValue('LBL_TEXT_FIELD')
        }).appendTo(dropDownStringContainer);

        var textStringContainer = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative mb-3'
        }).appendTo(dropDownStringContainer);

        $('<input>', {
            class: 'lib-form-control',
            id: context.getId('inputStringField'),
            autoComplete: 'off'
        }).appendTo(textStringContainer);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon clickable',
            type: 'button',
            id: context.getId('stringInputAddBtn')
        }).append('<i class="fa fa-plus"></i>').appendTo(textStringContainer);

        $('<label>', {
            class: 'lib-form-label lib-prop-title',
            text: _common.getLocalizedValue('LBL_OPERATOR_LIST')
        }).appendTo(dropDownStringContainer);

        var spanStringContainer = $('<div>', {
            class: 'lib-display-flex p-2 border lib-text-color-blue mb-3',
            id: context.getId('spanStringDiv')
        }).appendTo(dropDownStringContainer);

        $('<span>', {
            id: context.getId('spanJoin'),
            class: 'mr-3 clickable',
            text: 'Join'
        }).appendTo(spanStringContainer);

        $('<span>', {
            id: context.getId('spanSpace'),
            class: 'mr-3 clickable',
            text: 'Space'
        }).appendTo(spanStringContainer);

        $('<span>', {
            id: context.getId('spanOpenBracket'),
            class: 'mr-3 clickable',
            text: '('
        }).appendTo(spanStringContainer);

        $('<span>', {
            id: context.getId('spanCloseBracket'),
            class: 'mr-3 clickable',
            text: ')'
        }).appendTo(spanStringContainer);

        $('<span>', {
            id: context.getId('spanOrOperator'),
            class: 'mr-3 clickable',
            text: '||'
        }).appendTo(spanStringContainer);

        $('<label>', {
            class: 'lib-form-label lib-prop-title mandatory-star-red-after',
            text: _common.getLocalizedValue('LBL_FINAL_EXPRESSION')
        }).appendTo(dropDownStringContainer);

        var displayStringDiv = $('<div>', {
            class: 'lib-display-flex p-2 border '
        }).appendTo(dropDownStringContainer);

        $('<div>', {
            id: context.getId('formulaStringDisplay')
        }).appendTo(displayStringDiv);

        var displayStringBtnDiv = $('<div>', {
            class: 'ms-auto border-start pl-2 lib-text-center lib-min-w-80px'
        }).appendTo(displayStringDiv);

        $('<span>', {
            class: 'clickable lib-text-color-blue lib-display-block lib-cursor-pointer mb-2',
            id: context.getId('stringClearBtn'),
            text: _common.getLocalizedValue('LBL_CLEAR')
        }).appendTo(displayStringBtnDiv);

        $('<span>', {
            class: 'lib-text-color-blue clickable lib-display-block lib-cursor-pointer',
            id: context.getId('stringBackBtn'),
            text: _common.getLocalizedValue('LBL_UNDO')
        }).appendTo(displayStringBtnDiv);

        return dropDownStringContainer;
    }

    formBuilder.prototype.validateFile = function (id) {
        var context = this;
        var file = $("#" + id).prop('files');
        if (file) {
            if (file[0].type.includes('image')) {
                return true;
            } else {
                context.msgList.push("Only image is allowed");
                context.bindMessage('WARNING')
                return false;
            }
        }
    }

    formBuilder.prototype.bindPropertyFormTitle = function (id) {
        var context = this;
        var formTitleLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('formTitleId'),
        });

        $('<label>', {
            class: 'lib-form-label lib-prop-title mandatory-star-red-after',
            text: _common.getLocalizedValue('LBL_FORM_HEADER'),
        }).appendTo(formTitleLi);

        var formTitleInput = $('<input>', {
            class: 'lib-form-control',
            type: 'text',
            autoComplete: 'off',
            id: context.getId('titleId'),
        }).appendTo(formTitleLi);
        return formTitleLi;
    }

    formBuilder.prototype.bindPropertyLeftTitle = function (id) {
        var context = this;
        var leftTitleLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('leftTitleId'),
        });
        $('<label>', {
            class: 'lib-form-label lib-prop-title mandatory-star-red-after',
            text: _common.getLocalizedValue('LBL_LEFT_IMAGE'),
        }).appendTo(leftTitleLi);

        var leftTitleInput = $('<input>', {
            class: 'lib-form-control',
            type: 'file',
            accept: 'image/*',
            id: context.getId('leftInputTitleId'),
        }).appendTo(leftTitleLi);

        var leftTitleFileName = $('<div>', {
            class: 'no-change-class download-class div-image',
            id: context.getId('leftInputTitleId_div'),
        }).appendTo(leftTitleLi);

        return leftTitleLi;
    }

    formBuilder.prototype.bindPropertyRightTitle = function () {
        var context = this;
        var rightTitleLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('rightTitleId'),
        });
        $('<label>', {
            class: 'lib-form-label lib-prop-title mandatory-star-red-after',
            text: _common.getLocalizedValue('LBL_RIGHT_IMAGE'),
        }).appendTo(rightTitleLi);

        var rightTitleInput = $('<input>', {
            class: 'lib-form-control',
            type: 'file',
            accept: 'image/*',
            id: context.getId('rightInputTitleId'),

        }).appendTo(rightTitleLi);

        var rightTitleFileName = $('<div>', {
            class: 'no-change-class download-class div-image',
            id: context.getId('rightInputTitleId_div'),
        }).appendTo(rightTitleLi);

        return rightTitleLi;
    }

    formBuilder.prototype.bindPropertyPaddingLength = function () {
        var context = this;
        var paddingLengthLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('paddingLength'),
        });

        $('<label>', {
            class: 'lib-form-label lib-prop-title',
            text: _common.getLocalizedValue('LBL_LENGTH'),
        }).append($('<small>').text(' (' + _common.getLocalizedValue('LBL_CHARACTER)'))).appendTo(paddingLengthLi);

        var paddingLengthInput = $('<input>', {
            class: 'lib-form-control',
            type: 'number',
            id: context.getId('paddingLengthId'),
            placeholder: _common.getLocalizedValue('LBL_ENTER_NUMBER_BETWEEN_1_AND_10'),
            class: 'lib-form-control',
            oncopy: "return false",
            onpaste: "return false",
            oncut: "return false",
        }).appendTo(paddingLengthLi);


        paddingLengthInput.on('keydown', function (event) {
            return ['ArrowLeft', 'ArrowRight', 'Backspace'].includes(event.code) ? true : !/^[e.-]*$/.test(event.key);
        });
        paddingLengthInput.on('input', function () {
            context.updatePreview();
        });

        return paddingLengthLi;
    }

    formBuilder.prototype.createPrefixContainer = function () {
        var context = this;
        var prefixContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('prefix'),
        });

        $('<label>', {
            class: 'lib-form-label  lib-prop-title',
            text: _common.getLocalizedValue('LBL_PREFIX')
        }).appendTo(prefixContainer);

        var prefixInput = $('<input>', {
            class: 'lib-form-control',
            type: 'text',
            id: context.getId('prefixId'),
            autoComplete: 'off'
        }).appendTo(prefixContainer);
        prefixInput.on('keydown', function (event) {
            return ['ArrowLeft', 'ArrowRight'].includes(event.code) ? true : /^[^<>]*$/.test(event.key);
        });
        prefixInput.on('input', function () {
            context.updatePreview();
        });
        return prefixContainer;
    }

    formBuilder.prototype.createPostfixContainer = function () {
        var context = this;
        var postfixContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('postfix'),
        });

        $('<label>', {
            class: 'lib-form-label  lib-prop-title',
            text: _common.getLocalizedValue('LBL_POSTFIX')
        }).appendTo(postfixContainer);

        var postfixInput = $('<input>', {
            class: 'lib-form-control',
            type: 'text',
            id: context.getId('postfixId'),
            autoComplete: 'off'
        }).appendTo(postfixContainer);
        postfixInput.on('keydown', function (event) {
            return ['ArrowLeft', 'ArrowRight'].includes(event.code) ? true : /^[^<>]*$/.test(event.key);
        });
        postfixInput.on('input', function () {
            context.updatePreview();
        });

        return postfixContainer;
    }

    formBuilder.prototype.updatePreview = function () {
        var context = this;
        var prefix = $("#" + this.getId("prefixId")).val();
        var paddingLengthInput = $("#" + this.getId("paddingLengthId")).val();
        var postfix = $("#" + this.getId("postfixId")).val();
        var paddingIndex = 0;
        if (paddingLengthInput && !isNaN(paddingLengthInput) && paddingLengthInput > 0) {
            var padding = '0'.repeat(paddingLengthInput);
            paddingIndex = padding.length;
        }
        var previewText = prefix + (paddingIndex > 0 ? padding.substring(0, paddingIndex) : '') + postfix;
        $("#" + this.getId("previewId")).text(previewText);
    }

    formBuilder.prototype.createPropertyPreview = function (prefixLi, postfixLi, paddingLengthLi) {
        var context = this;
        var previewContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('preview'),
        });

        $('<label>', {
            class: 'lib-form-label lib-prop-title',
            text: _common.getLocalizedValue('LBL_PREVIEW')
        }).appendTo(previewContainer);

        var previewSpan = $('<span>', {
            class: 'lib-form-group',
            id: context.getId('previewId'),
        }).appendTo(previewContainer);

        return previewContainer;
    }

    formBuilder.prototype.createRadioButtonContainer = function () {

        var context = this;
        var listContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });

        var divCover = $('<div>', {
            class: 'lib-display-flex',
            id: context.getId('radioBtnDiv')
        }).appendTo(listContainer);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex pl-0'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "lovDataSource",
            value: "LOV"
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_LOV'),
        })).appendTo(divCover);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "lovDataSource",
            value: "FORM",
            id: context.getId('formBtnRadio')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_FORM')
        })).appendTo(divCover);

        return listContainer;
    };

    formBuilder.prototype.createLocationRadioContainer = function () {
        var context = this;
        var listContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });

        var divCover = $('<div>', {
            class: 'lib-display-block',
            id: context.getId('radioBtnDiv')
        }).appendTo(listContainer);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex pl-0'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "location",
            value: "SELECTION",
            id: context.getId('selectionBtn')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_SELECTION'),
        })).appendTo(divCover);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex pl-0'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "location",
            value: "FROMLOCATION",
            id: context.getId('fromLocationBtn')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_FROM_LOCATION')
        })).appendTo(divCover);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex pl-0'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "location",
            value: "TOLOCATION",
            id: context.getId('toLocationBtn')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_TO_LOCATION')
        })).appendTo(divCover);

        return listContainer;
    };

    formBuilder.prototype.createUserRadioContainer = function () {
        var context = this;
        var listContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });

        var divCover = $('<div>', {
            class: 'lib-display-block',
            id: context.getId('radioBtnDiv')
        }).appendTo(listContainer);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex pl-0'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "userDetail",
            value: "FIRSTNAME",
            id: context.getId('firstNameBtn')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_FIRST_NAME'),
        })).appendTo(divCover);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex pl-0'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "userDetail",
            value: "FIRSTLASTNAME",
            id: context.getId('firstLastNameBtn')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_FIRST_LAST_NAME')
        })).appendTo(divCover);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex pl-0'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "userDetail",
            value: "EMAILID",
            id: context.getId('emailIdBtn')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_EMAILID')
        })).appendTo(divCover);

        return listContainer;
    };

    formBuilder.prototype.createCoordinateRadioContainer = function () {
        var context = this;
        var listContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var divCover = $('<div>', {
            class: 'lib-display-block',
            id: context.getId('radioBtnDiv')
        }).appendTo(listContainer);

        var label1 = $('<div>', {
        }).appendTo(divCover);

        var label2 = $('<div>', {
        }).appendTo(divCover);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-inline-flex pl-0'
        }).append($('<input>', {
            class: '',
            type: 'radio',
            name: 'coordinate',
            value: 'POINT',
            id: context.getId('pointBtn'),
            checked: true
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_POINT')
        })).appendTo(label1);

        $('<label>', {
            class: 'lib-form-label mb-2 lib-form-check lib-display-inline-flex pl-0'
        }).append($('<input>', {
            class: '',
            type: 'radio',
            name: 'coordinate',
            value: 'LINE',
            id: context.getId('lineBtn')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_LINE')
        })).appendTo(label2);

        return listContainer;
    };


    formBuilder.prototype.bindTransactionRadioBtn = function () {
        var context = this;
        var transactionContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });

        var transactionDivCover = $('<div>', {
            class: 'lib-display-block',
            id: context.getId('transactionBtnDiv')
        }).appendTo(transactionContainer);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex pl-0'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "transaction",
            value: "DISPATCH",
            id: context.getId('dispatchBtn')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_DISPATCH'),
        })).appendTo(transactionDivCover);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex pl-0'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "transaction",
            value: "RECEIPT",
            id: context.getId('receiptBtn')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_RECEIPT')
        })).appendTo(transactionDivCover);

        $('<label>', {
            class: 'lib-form-label lib-form-check lib-display-flex pl-0'
        }).append($('<input>', {
            class: '',
            type: "radio",
            name: "transaction",
            value: "RETURN",
            id: context.getId('returnBtn')
        })).append($('<span>', {
            class: 'pl-2',
            text: _common.getLocalizedValue('LBL_RETURN')
        })).appendTo(transactionDivCover);

        return transactionContainer;
    }

    formBuilder.prototype.createSelectDropdownContainer = function () {
        var context = this;
        var dropDownContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('lovDiv'),
            style: 'display:none;'
        });

        $('<label>', {
            class: 'lib-form-label mandatory-star-red-after lib-prop-title',
            text: _common.getLocalizedValue('LBL_LOV')
        }).appendTo(dropDownContainer);

        var divBtnDropdown = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative',
        }).appendTo(dropDownContainer);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('ddlDropdownBox')
        }).appendTo(divBtnDropdown);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon',
            type: "button",
            id: context.getId('addLov')
        }).append($('<i>', {
            class: "fa fa-plus",
        })).appendTo(divBtnDropdown);

        return dropDownContainer;
    }

    formBuilder.prototype.createServiceContainer = function () {
        var context = this;
        var dropDownContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('serviceDiv'),
            style: 'display:none;'
        });
        $('<label>', {
            class: 'lib-form-label  lib-prop-title',
            text: _common.getLocalizedValue('LBL_API')
        }).appendTo(dropDownContainer);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('selectApi')
        }).appendTo(dropDownContainer);

        return dropDownContainer;
    }

    formBuilder.prototype.createFormContainer = function () {
        var context = this;
        var dropDownContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('formDropdownDiv'),
            style: 'display:none;'
        });

        $('<label>', {
            class: 'lib-form-label mandatory-star-red-after lib-prop-title',
            text: _common.getLocalizedValue('LBL_FORM')
        }).appendTo(dropDownContainer);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('formDropdown')
        }).appendTo(dropDownContainer);

        $('<label>', {
            class: 'lib-form-label lib-prop-title',
            text: _common.getLocalizedValue('LBL_FORM_ATTRIBUTES')
        }).appendTo(dropDownContainer);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('formAttributesList')
        }).appendTo(dropDownContainer);

        var $columnLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('formConditionColumnLi'),
        });

        var $columnLabel = $('<label>', {
            class: 'lib-form-label',
            "data-tkey": '' + context.getUUID() + ''
        }).text(_common.getLocalizedValue('LBL_CONDITIONS'));

        $columnLabel.appendTo($columnLi);

        var $button = $('<button>', {
            class: "lib-input-btn-custom add-btn-circle-right-top",
            type: "button",
            id: context.getId('addFormConditionBtn'),
            title: _common.getLocalizedValue('LBL_ADD')
        }).append($('<i>', {
            class: "fa fa-plus",
        })).appendTo($columnLi);

        var $rangeUlLi = $('<ul>', {
            class: 'lib-form-group no-change-class lib-prop-p pl-0 pr-0',
            id: context.getId("formConditionColumns")
        });
        $columnLi.appendTo(dropDownContainer);
        $rangeUlLi.appendTo(dropDownContainer);
        return dropDownContainer;
    }

    formBuilder.prototype.createFormConditionRows = function (definitionId, autoId, value) {
        const context = this;
        const id = context.getUUID();
        const $labelLi = context.createLabelLi(id, autoId);
        const $divFirst = context.createAndOrDiv(autoId, definitionId);
        const $divSecond = context.createFormConditionColumns(definitionId, autoId, value, id);

        if ($('#' + context.getId("formConditionColumns")).find('li').length >= 1) {
            $labelLi.append($divFirst, $divSecond);
        } else {
            $labelLi.append($divSecond);
        }
        $("#" + context.getId("formConditionColumns")).append($labelLi);
        context.bindLeftFormCondition(autoId + "leftAdditionalCondition", value?.lovAttrId);
        context.bindAndOrDiv(undefined, autoId + "andOrDiv", value?.condition);
        context.bindRightFormCondition(autoId + "rightAdditionalCondition", value?.lovValueId, autoId);
        context.bindFormConditionDeleteEvent(definitionId, id);
        context.onLeftFormConditionChange();
    };


    formBuilder.prototype.createFormConditionColumns = function (definitionId, autoId, value, id) {
        var context = this;
        const $flexWrapperFirst = $('<div>', { class: 'lib-display-flex p-3' });
        const $flexWrapper = $('<div>', { class: 'lib-display-flex p-3' });
        const $column1 = this.createDropdownColumn(autoId + "leftAdditionalCondition", 'left-condition', autoId);
        const $column2 = this.createOperatorColumn();
        const $column3 = this.createDropdownColumn(autoId + "rightAdditionalCondition", 'right-condition');

        $flexWrapper.append($column1, $column2, $column3);

        const $divSecond = $('<div>', {
            class: 'lib-column-with-delete-field lib-position-relative box-repeat-border',
        }).append($flexWrapper);

        this.createDeleteButton($divSecond, id);
        return $divSecond;
    };

    formBuilder.prototype.bindFormConditions = function () {
        const context = this;
        var template_id = $("#" + context.getId('formDropdown')).find(":selected").val();
        $("#" + context.getId("formConditionColumns")).find('li').each(function () {
            var autoId = $(this).attr('auto-id');
            context.bindLeftFormCondition(autoId + "leftAdditionalCondition", undefined);
            context.bindAndOrDiv(undefined, autoId + "andOrDiv", undefined);
            context.bindRightFormCondition(autoId + "rightAdditionalCondition", undefined, autoId);
        });
    };

    formBuilder.prototype.bindFormConditionDeleteEvent = function (definitionId, id) {
        const context = this;
        const currentComponent = context.getComponent(definitionId);
        $("#" + context.getId("formConditionColumns")).find(".row-delete-cross").unbind("click").bind("click", function () {
            const deleteId = $(this).attr("data-id");
            $('#' + deleteId).remove();
            context.saveDropDownPropertiesData(currentComponent);
        });
    };

    formBuilder.prototype.onLeftFormConditionChange = function () {
        var context = this;
        $("#" + context.getId('formConditionColumns')).find('.left-condition').off('change').on('change', function () {
            var lovId = $(this).val();
            $("#" + autoId + 'rightAdditionalCondition').empty();
            if (lovId) {
                var autoId = $(this).attr('auto-id');
                context.bindRightFormCondition(autoId + "rightAdditionalCondition", '', autoId);
            }
        });
    }

    formBuilder.prototype.bindRightFormCondition = function (id, value, autoId) {
        var context = this;
        var lovId = $("#" + autoId + 'leftAdditionalCondition').find(":selected").attr('lov-id');
        if (lovId) {
            context.toggleLoader(1);
            $('#' + id).empty();
            $("#" + id).append($("<option>").val('').text(_common.getLocalizedValue('LBL_SELECT')));
            context.getApiData(context.host.anarServiceUrl + "api/getListOfValues/" + lovId, function (result) {
                if (result.data?.lovDetails.length > 0) {
                    result.data?.lovDetails.forEach(details => {
                        $("#" + id).append($("<option>").val(details.id).text(details.lovValueName));
                    })
                }
                context.toggleLoader(0);
                value ? $("#" + id).val(value) : null;
            });
        }
    }

    formBuilder.prototype.bindLeftFormCondition = function (id, value) {
        var context = this;
        var template_id = $("#" + context.getId('formDropdown')).find(":selected").val();
        if (template_id) {
            var template = context.filter(context.templateList, { template_id: template_id })[0];
            $('#' + id).empty();
            $("#" + id).append($("<option>").val('').text(_common.getLocalizedValue('LBL_SELECT')));
            template?.definitions?.forEach(def => {
                if ((def.subType == 'select' && def.configProperties.dataSourceType == 'LOV') || def.subType == 'radio') {
                    $("#" + id).append($("<option>").val(def.id).attr('lov-id', def.configProperties.lovId).attr('def-type', def.subType).text(def.label));
                }
            });
        }
        value ? $("#" + id).val(value) : null;
    }

    formBuilder.prototype.bindPropertyEnableRangeFilter = function () {
        var context = this;

        var $mandatoryLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('enableRangeFilterLi'),
            style: 'display:none;'
        });

        var $mandatoryLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $mandatoryInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('enableRangeFilter')
        });

        var $mandatorySpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_ENABLE_RANGE_FILTER')).attr("for", context.getId('enableRangeFilter'));

        $mandatoryLabel.append($mandatoryInput, $mandatorySpan);
        return $mandatoryLi.append($mandatoryLabel);
    }

    formBuilder.prototype.bindPropertiesEnabledRange = function () {
        var context = this;

        var $columnLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('rangeColumnLi'),
            style: 'display:none;'
        });

        var $columnLabel = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            "data-tkey": '' + context.getUUID() + ''
        }).text(_common.getLocalizedValue('LBL_RANGE_CONDITIONS'));

        $columnLabel.appendTo($columnLi);

        var $button = $('<button>', {
            class: "lib-input-btn-custom add-btn-circle-right-top",
            type: "button",
            id: context.getId('addRangeBtn'),
            title: _common.getLocalizedValue('LBL_ADD')
        }).append($('<i>', {
            class: "fa fa-plus",
        }));
        var $rangeUlLi = $('<ul>', {
            class: 'lib-form-group no-change-class lib-prop-p pl-0 pr-0',
            id: context.getId("rangeColumns")
        });
        $button.appendTo($columnLi);
        $rangeUlLi.appendTo($columnLi);
        return ([$columnLi])
    }

    formBuilder.prototype.createRangeConditionRows = function (definitionId, autoId, value) {
        var context = this;
        var id = context.getUUID();
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p pl-0 pr-0',
            id: id
        });

        var $divFirst = $('<div>', {
            class: 'lib-col-12 mb-2 lib-display-flex lib-justify-content-center lib-position-relative',
        });

        var $divSecond = $('<div>', {
            class: 'lib-display-flex lib-column-with-delete-field lib-position-relative',
        });

        var $andOrDiv = $('<select>', {
            id: autoId + "andOrDiv",
            class: 'lib-form-control lib-col-4 and-or-condition',
            autoComplete: 'off',
        });

        var $inputBox1 = $('<select>', {
            id: autoId + "leftCondition",
            class: 'lib-form-control left-condition',
            autoComplete: 'off',
        });

        var $inputBox3 = $('<select>', {
            id: autoId + "operatorCondition",
            class: 'lib-form-control mr-2 ml-2 operator-condition',
            autoComplete: 'off',
        });

        var $inputBox2 = $('<select>', {
            id: autoId + "rightCondition",
            class: 'lib-form-control mr-2 right-condition',
            autoComplete: 'off',
        });

        var $inputBox4 = $('<select>', {
            id: autoId + "betweenCondition",
            class: 'lib-form-control between-condition',
            autoComplete: 'off',
            style: 'display:none;',
        });

        var $divDelete = $('<div>', {
            class: "lib-tool-delete row-delete-cross no-change-class mr-2",
            "data-id": id,
            title: _common.getLocalizedValue('LBL_DELETE')
        }).append($('<i>', {
            class: "fa fa-times",
            "aria-hidden": "true"
        }));

        $divFirst.append($andOrDiv);
        $divSecond.append($inputBox1, $inputBox3, $inputBox2, $inputBox4, $divDelete);

        if ($('#' + context.getId("rangeColumns")).find('li').length >= 1) {
            $labelLi.append($divFirst, $divSecond)
        } else {
            $labelLi.append($divSecond)
        }
        $("#" + context.getId("rangeColumns")).append($labelLi);

        context.bindLeftRangeColumnCondition(definitionId, autoId + "leftCondition", value?.attribute1Id);
        context.bindComparisonOperatorsDropDown(definitionId, autoId + "operatorCondition", value?.operator);
        context.bindRightRangeColumnCondition(definitionId, autoId + "rightCondition", value?.attribute2Id);
        context.bindRightRangeColumnCondition(definitionId, autoId + "betweenCondition", value?.attribute3Id);
        context.bindAndOrDiv(definitionId, autoId + "andOrDiv", value?.condition);
        var currentComponent = context.getComponent(definitionId);
        $("#" + context.getId("rangeColumns")).find(".row-delete-cross").unbind("click").bind("click", function () {
            var $this = $(this);
            var deleteId = $this.attr("data-id");
            var $li = $this.closest('li');
            var rowIndex = $li.index();
            if ($('#' + context.getId("rangeColumns")).find('.row-delete-cross').length > 1 && !(rowIndex === 0)) {
                $('#' + deleteId).remove();
                context.saveDropDownPropertiesData(currentComponent);
            }
        });

    }

    formBuilder.prototype.bindPropertiesAdditionalCondition = function () {
        var context = this;

        var $columnLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('additionalConditionColumnLi'),
            style: 'display:none;',
        });

        var $columnLabel = $('<label>', {
            class: 'lib-form-label',
            "data-tkey": '' + context.getUUID() + ''
        }).text(_common.getLocalizedValue('LBL_DATA_EXIST'));

        $columnLabel.appendTo($columnLi);

        var $button = $('<button>', {
            class: "lib-input-btn-custom add-btn-circle-right-top",
            type: "button",
            id: context.getId('addConditionBtn'),
            title: _common.getLocalizedValue('LBL_ADD')
        }).append($('<i>', {
            class: "fa fa-plus",
        }));

        var $rangeUlLi = $('<ul>', {
            class: 'lib-form-group no-change-class lib-prop-p pl-0 pr-0',
            id: context.getId("additionalConditionColumns")
        });
        $button.appendTo($columnLabel);
        $rangeUlLi.appendTo($columnLi);
        return ([$columnLi])
    }

    // For creating Data existing div
    formBuilder.prototype.createAdditionalConditionRows = function (definitionId, autoId, value) {
        const context = this;
        debugger
        const id = context.getUUID();

        const $labelLi = context.createLabelLi(id, autoId);
        const $divFirst = context.createAndOrDiv(autoId, definitionId);
        const $divSecond = context.createConditionColumns(definitionId, autoId, value, id);

        if ($('#' + context.getId("additionalConditionColumns")).find('li').length >= 1) {
            $labelLi.append($divFirst, $divSecond);
        } else {
            $labelLi.append($divSecond);
        }

        $("#" + context.getId("additionalConditionColumns")).append($labelLi);
        context.bindConditionEvents(definitionId, autoId, value);
        context.bindDeleteEvent(definitionId, id);
        context.onDataExistenceDropDownChangeAdditional();
        context.onLeftAdditionalConditionChange();
    };

    formBuilder.prototype.createLabelLi = function (id, autoId) {
        return $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p pl-0 pr-0',
            id: id,
            "auto-id": autoId,
        });
    };

    formBuilder.prototype.createAndOrDiv = function (autoId, definitionId) {
        const $divFirst = $('<div>', {
            class: 'lib-col-12 mb-3 lib-display-flex lib-justify-content-center lib-position-relative',
        });

        const $andOrDiv = $('<select>', {
            id: autoId + "andOrDiv",
            class: 'lib-form-control lib-col-4 and-or-condition',
            autoComplete: 'off',
        });

        $divFirst.append($andOrDiv);
        return $divFirst;
    };

    formBuilder.prototype.createConditionColumns = function (definitionId, autoId, value, id) {
        const $flexWrapperFirst = $('<div>', { class: 'lib-display-flex p-3' });
        const $flexWrapper = $('<div>', { class: 'lib-display-flex p-3' });

        const $columnOne = this.createColumn('LBL_DATA_EXISTS', autoId + 'existingDataFormDropdown', 'existing-data-form', definitionId, autoId, "pr-3");
        const $columnTwo = this.createColumn('LBL_DATA_EXIST_ATTRIBUTES', autoId + 'dataExistAttributeList', 'existing-data-attribute');
        const $column1 = this.createDropdownColumn(autoId + "leftAdditionalCondition", 'left-condition', autoId);
        const $column2 = this.createOperatorColumn();
        const $column3 = this.createDropdownColumn(autoId + "rightAdditionalCondition", 'right-condition');

        $flexWrapperFirst.append($columnOne, $columnTwo);
        $flexWrapper.append($column1, $column2, $column3);

        const $divSecond = $('<div>', {
            class: 'lib-column-with-delete-field lib-position-relative box-repeat-border',
        }).append($flexWrapperFirst, $flexWrapper);

        this.createDeleteButton($divSecond, id);
        return $divSecond;
    };

    formBuilder.prototype.createColumn = function (labelTextKey, dropdownId, additonalClass, definitionId, autoId, marginClass) {
        const $column = $('<div>', { class: 'lib-col-6 ' + marginClass });

        $('<label>', {
            class: 'lib-form-label lib-prop-title',
            text: _common.getLocalizedValue(labelTextKey),
        }).appendTo($column);

        $('<select>', {
            class: 'lib-form-control ' + additonalClass,
            id: this.getId(dropdownId),
            "def-id": definitionId,
            "auto-id": autoId,
        }).appendTo($column);

        return $column;
    };

    formBuilder.prototype.createDropdownColumn = function (id, additionalClass, autoId) {
        return $('<div>', { class: 'lib-col-5' }).append(
            $('<select>', {
                id: id,
                class: `lib-form-control ${additionalClass}`,
                autoComplete: 'off',
                "auto-id": autoId,
            })
        );
    };

    formBuilder.prototype.createOperatorColumn = function () {
        return $('<div>', {
            class: 'lib-col-2 lib-display-flex lib-align-items-center lib-justify-content-center',
        }).append($('<label>', { text: '=' }));
    };

    formBuilder.prototype.createDeleteButton = function ($parent, id) {
        const $divDelete = $('<div>', {
            class: "lib-tool-delete row-delete-cross no-change-class mr-2",
            "data-id": id,
            title: _common.getLocalizedValue('LBL_DELETE'),
        }).append($('<i>', { class: "fa fa-times", "aria-hidden": "true" }));

        $parent.append($divDelete);
    };

    formBuilder.prototype.bindConditionEvents = function (defId, autoId, value) {
        const context = this;
        context.bindExistingDataDropdownFormAdditional(autoId, value?.dataExistingTemplateId);
        context.bindFilteredAttributesForDataExistenceAdditional(value?.dataExistingTemplateId, value?.dataExistingAttrId, autoId);
        context.bindLeftAdditionalCondition(autoId + "leftAdditionalCondition", value?.lovConditionList[0]?.lovAttrId, autoId);
        context.bindAndOrDiv(defId, autoId + "andOrDiv", value?.condition);
        context.bindRightAdditionalCondition(autoId + "rightAdditionalCondition", value?.lovConditionList[0]?.lovValueId, autoId);
    };

    formBuilder.prototype.bindDeleteEvent = function (definitionId, id) {
        const context = this;
        const currentComponent = context.getComponent(definitionId);
        $("#" + context.getId("additionalConditionColumns")).find(".row-delete-cross").unbind("click").bind("click", function () {
            const deleteId = $(this).attr("data-id");
            $('#' + deleteId).remove();
            context.saveDropDownPropertiesData(currentComponent);
        });
    };

    formBuilder.prototype.bindLeftAdditionalCondition = function (id, value, autoId) {
        var context = this;
        var template_id = $("#" + context.getId(autoId + 'existingDataFormDropdown')).find(":selected").val();
        if (template_id) {
            var template = context.filter(context.templateList, { template_id: template_id })[0];
            $('#' + id).empty();
            $("#" + id).append($("<option>").val('').text(_common.getLocalizedValue('LBL_SELECT')));
            template?.definitions?.forEach(def => {
                if ((def.subType == 'select' && def.configProperties.dataSourceType == 'LOV' && !def.configProperties.multiSelect) || def.subType == 'radio') {
                    $("#" + id).append($("<option>").val(def.id).attr('lov-id', def.configProperties.lovId).attr('def-type', def.subType).text(def.label));
                }
            });
        }
        value ? $("#" + id).val(value) : null;
    }

    formBuilder.prototype.bindRightAdditionalCondition = function (id, value, autoId) {
        var context = this;
        var lovId = $("#" + autoId + 'leftAdditionalCondition').find(":selected").attr('lov-id');
        if (lovId) {
            context.toggleLoader(1);
            $('#' + id).empty();
            $("#" + id).append($("<option>").val('').text(_common.getLocalizedValue('LBL_SELECT')));
            context.getApiData(context.host.anarServiceUrl + "api/getListOfValues/" + lovId, function (result) {
                if (result.data?.lovDetails.length > 0) {
                    result.data?.lovDetails.forEach(details => {
                        $("#" + id).append($("<option>").val(details.id).text(details.lovValueName));
                    })
                }
                context.toggleLoader(0);
                value ? $("#" + id).val(value) : null;
            });
        }
    }

    formBuilder.prototype.onDataExistenceDropDownChangeAdditional = function () {
        var context = this;
        debugger
        $("#" + context.getId('additionalConditionColumns')).find('.existing-data-form').off('change').on('change', function () {
            var template_id = $(this).val();
            if (template_id) {
                var defId = $(this).attr('def-id');
                var autoId = $(this).attr('auto-id');
                context.bindFilteredAttributesForDataExistenceAdditional(template_id, '', autoId);
                context.bindLeftAdditionalCondition(autoId + "leftAdditionalCondition", undefined, autoId);
            } else {
                $("#" + context.getId("dataExistAttributeList")).empty();
            }
        });
    }

    formBuilder.prototype.onLeftAdditionalConditionChange = function () {
        var context = this;
        $("#" + context.getId('additionalConditionColumns')).find('.left-condition').off('change').on('change', function () {
            var lovId = $(this).val();
            if (lovId) {
                var autoId = $(this).attr('auto-id');
                context.bindRightAdditionalCondition(autoId + "rightAdditionalCondition", '', autoId);
            } else {
                $("#" + autoId + 'rightAdditionalCondition').empty();
            }
        });
    }

    formBuilder.prototype.bindPropertyFormDropDown = function (id, label) {
        var context = this;
        var formDropDownContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('formDropdownDiv_' + id),
        });
        var labelClass = 'lib-form-label lib-prop-title';
        if (id !== 'rdiRuleAndAssignment') {
            labelClass += ' mandatory-star-red-after';
        }
        $('<label>', {
            class: labelClass,
            text: _common.getLocalizedValue(label),
        }).appendTo(formDropDownContainer);
        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('dropdownBox_' + id),
        }).appendTo(formDropDownContainer);
        return formDropDownContainer;
    }

    formBuilder.prototype.bindPropertySidesLabel = function (id, label) {
        var context = this;
        var $sidesLabelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });
        var $sidesLabel = $('<label>', {
            class: 'lib-form-label'
        }).append($('<span>', {
            class: 'lib-text-normal',
            text: _common.getLocalizedValue('LBL_SIDES_LABEL')
        })).append($('<small>', {
            class: 'lib-text-normal',
            text: ' (' + _common.getLocalizedValue('LBL_USE_COMMA') + ')'
        }));
        var $sidesLabelInput = $('<input>', {
            type: 'text',
            id: context.getId('dropdownBox_sidesLabel'),
            class: 'lib-form-control',
            autoComplete: 'off',
        });
        return $sidesLabelLi.append($sidesLabel, $sidesLabelInput);
    }

    formBuilder.prototype.bindPropertyNumberDropDown = function (id, label) {
        var context = this;
        $("#" + context.getId('numberDropdownDiv_' + id)).remove();
        var numberDropDownContainer = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('numberDropdownDiv_' + id)
        });
        $('<label>', {
            class: 'lib-form-lab mandatory-star-red-after',
            text: _common.getLocalizedValue(label),
        }).appendTo(numberDropDownContainer);
        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('dropdownBox_' + id)
        }).appendTo(numberDropDownContainer);
        return numberDropDownContainer;
    }

    formBuilder.prototype.createTabContainer = function () {
        var context = this;
        var tabsDiv = $('<div>', {
            id: context.getId("libTabs")
        });
        var ul = $('<ul>', {
            class: "lib-custom-tabs"
        });

        var tab1 = $('<li>', {}).append(
            $('<a>', {
                href: "#tabStatic",
                text: _common.getLocalizedValue('LBL_STATIC')
            }));
        var tab2 = $('<li>', {}).append(
            $('<a>', {
                href: "#tabAPI",
                text: "API"
            }));

        ul.append(tab1);
        ul.append(tab2);

        var div1 = $('<div>', {
            id: "tabStatic"
        }).append($('<p>', {
            text: "tabStatic"
        }));

        var div2 = $('<div>', {
            id: "tabAPI"
        }).append($('<p>', {
            text: "tabAPI"
        }));

        tabsDiv.append(ul);
        tabsDiv.append(div1);
        tabsDiv.append(div2);

        $("#" + context.getId('tabs')).append(tabsDiv);
    }

    formBuilder.prototype.headerSection = function () {
        var context = this;
        var isCustom = 'lib-hide';
        var template_nameDiv = $("<div>", {
            class: "column lib-col-3 lib-width-auto",
        }).append($("<div>", {
            class: "lib-form-group",
        }).append(
            $("<label>", {
                class: "lib-form-label",
                text: _common.getLocalizedValue('LBL_TEMPLATE_NAME'),
            }))
            .append(
                $("<input>", {
                    class: "lib-form-control p-2",
                    autoComplete: "off",
                    id: context.getId("template_name"),
                    placeholder: _common.getLocalizedValue('LBL_NAME'),
                })));

        var templateKeyDiv = $("<div>", {
            class: "column lib-col-2 lib-width-auto lib-hide",
        }).append($("<div>", {
            class: "lib-form-group ml-2",
        }).append(
            $("<label>", {
                class: "lib-form-label",
                text: _common.getLocalizedValue('LBL_TEMPLATE_KEY')
            }))
            .append(
                $("<input>", {
                    class: "lib-form-control p-2",
                    id: context.getId("template_key"),
                    autoComplete: "off",
                    placeholder: _common.getLocalizedValue('LBL_KEY'),
                })));


        var divIntState = $('<div>', {
            class: 'lib-input-group lib-position-relative',
        }).append($('<div>', {
            class: 'lib-w-100 lib-position-relative lib-adjust-height-padding-child-input',
            id: context.getId('final_status')
        }));
        var final_status = $("<div>", {
            class: "column lib-col-2 lib-width-auto",
        }).append($("<div>", {
            class: "lib-form-group",
        }).append(
            $("<label>", {
                class: "lib-form-label",
                text: _common.getLocalizedValue('LBL_FINAL_STATUS')
            }))
            .append(divIntState));

        var result_status = $("<div>", {
            class: "column lib-col-2 lib-width-auto",
        }).append($("<div>", {
            class: "lib-form-group ml-2",
        })
            .append(
                $("<label>", {
                    class: "lib-form-label",
                    text: _common.getLocalizedValue("LBL_PARENT_RESULT_STATUS")
                }))
            .append(
                $("<select>", {
                    class: "lib-form-control",
                    id: context.getId("result_status"),
                })));

        var templateType = $("<div>", {
            class: "column lib-col-2 lib-width-auto " + isCustom,
        }).append($("<div>", {
            class: "lib-form-group ml-2",
        })
            .append(
                $("<label>", {
                    class: "lib-form-label",
                    text: _common.getLocalizedValue("LBL_TEMPLATE_TYPE")
                }))
            .append(
                $("<input>", {
                    class: "lib-form-control p-2",
                    id: context.getId("template_type"),
                })));
        var $selectElement = $("<select>", {
            class: "lib-form-control p-2",
            id: context.getId("ddl_feature_type")
        });

        var featureTypeDiv = $("<div>", {
            class: "column lib-col-3 lib-width-auto"
        }).append($("<div>", {
            class: "lib-form-group ml-3"
        }).append(
            $("<label>", {
                class: "lib-form-label",
                text: _common.getLocalizedValue("LBL_FEATURE_TYPE")
            })
        ).append(
            $selectElement
        ));

        var $partitionLi = $('<div>', {
            class: 'column lib-col-3 lib-width-auto'
        });

        var $partitionLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch ml-2 mb-2'
        });

        var $partitionInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('excludeFromPartition')
        });

        var $partitionSpan = $('<label>').addClass('lib-form-check-box-label ml-2').text(_common.getLocalizedValue('LBL_EXCLUDE_FORM_PARTITION')).attr("for", context.getId('excludeFromPartition'));
        $partitionLi.append($partitionLabel.append($partitionInput, $partitionSpan));

        var $markAsCenterDiv = $('<div>', {
            class: 'column lib-col-3 lib-width-auto'
        });
        var $markAsCenterLineLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch ml-3 mb-2'
        });

        var $markAsCenterLineInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('markAsCenterLine')
        });

        var $markAsCenterLineSpan = $('<label>').addClass('lib-form-check-box-label ml-2').text(_common.getLocalizedValue('LBL_MARK_AS_CENTER_LINE')).attr("for", context.getId('markAsCenterLine'));
        $markAsCenterLineLabel.append($markAsCenterLineInput, $markAsCenterLineSpan);
        $markAsCenterDiv.append($markAsCenterLineLabel);

        var classHistory = context.template_id ? "" : "lib-hide";
        classHistory = context.isClone === true ? "lib-hide" : classHistory;


        var topButtonContainer = $("<div>", {
            class: "column lib-flex-grow-1",
        }).append($("<div>", {
            class: "text-right mt-2",
        }).append($("<button>", {
            class: "lib-btn-custom lib-rounded-4",
            type: "button",
            style: "display:none",
            id: context.getId("spatialRuleBtn"),
            text: _common.getLocalizedValue('LBL_SPATIAL')
        })).append($("<button>", {
            class: "lib-btn-custom lib-rounded-4",
            type: "button",
            id: context.getId("previewBtn"),
            text: _common.getLocalizedValue('LBL_PREVIEW')
        })).append($("<button>", {
            class: "lib-btn-custom lib-rounded-4",
            type: "button",
            id: context.getId("globalSave"),
            text: _common.getLocalizedValue('LBL_SAVE')
        })).append($("<button>", {
            class: "lib-btn-custom lib-reset-btn lib-rounded-4",
            type: "button",
            id: context.getId("cancelBtn"),
            text: _common.getLocalizedValue('LBL_CANCEL')
        })));

        var secondLineWrapper = $("<div>", {
            class: "column lib-col-12 lib-display-flex mt-3"
        }).append($partitionLi, $markAsCenterDiv);

        var filterWrapper = $("<div>", {
            class: "column lib-col-12 lib-display-flex lib-align-items-center",
            id: context.getId("filterShowHide"),
            style: "display:none"
        }).append(final_status, result_status, templateType);

        var horizontalBdr = $("<div>", {
            class: "column lib-col-12 mt-2 mb-2",
        }).append($("<hr>"));

        return [template_nameDiv, templateKeyDiv, featureTypeDiv, topButtonContainer, secondLineWrapper, filterWrapper, horizontalBdr];
    }


    formBuilder.prototype.bindGlobalEvent = function () {
        var context = this;
        $("#" + context.getId("globalSave")).unbind("click").bind("click", function () {
            context.setTemplateData();
        });
        $("#" + context.getId("cancelBtn")).unbind("click").bind("click", function () {
            context.callbacks.backTemplateCallBack();
        });
        $("#" + context.getId("spatialRuleBtn")).unbind("click").bind("click", function () {
            context.onSpatialClick(context);
        });
        $("#" + context.getId("previewBtn")).unbind("click").bind("click", function () {
            context.onPreviewClick(context);
        });
        $("#" + context.getId("ddl_feature_type")).on("change", function () {
            var selectedValue = $(this).find(":selected").val();
            context.feature_id = selectedValue;
            $("#" + context.getId(context.componentId)).trigger("click");
        });
        $("#" + context.getId("validationClick")).unbind("click").bind("click", function () {
            if (context.definitionList.length > 0) {
                context.onValidationClick();
            }
            else {
                context.msgList.push("Please drag atleast one attribute");
                context.bindMessage('WARNING');
                return;
            }
        });

        $("#" + context.getId("filterClick")).unbind("click").bind("click", function () {
            $('#' + context.getId("filterShowHide")).toggle();
        });

        $("#" + context.getId("historyClick")).unbind("click").bind("click", function () {
            context.showHistoryModal();
        });

        $(".lib-accordion-head").off('click').on('click', function () {
            var content = $(this).next(".lib-accordion-content");
            $(".lib-accordion-head").not(this).removeClass('active');
            $(".lib-accordion-content").not(content).slideUp().removeClass('active');
            $(this).toggleClass('active');
            content.slideToggle().toggleClass('active');
        });

    }

    formBuilder.prototype.onCancelBtnClick = function () {
        var context = this;
        context.modal(1);
        context.onChangeTemplate();
    }

    formBuilder.prototype.getTemplateData = function () {
        var context = this;
        var template = context.templateMetadata.templateDetails;
        context.next_seq = template.next_seq;
        context.dev_options = template.dev_options;
        context.resultData = template.validation;
        context.tableName = template.table_name;
        context.version = template?.version;
        context.template_name_history = template.template_name;
        context.bindTemplateName(template.template_name, template.template_key, template.final_status, template.result_status, template.template_type, template.feature_id, template.excluded_from_entity, template.mark_as_center_line, template.definitions);
        if ((template.definitions && template.definitions.length > 0)) {
            context.definitionList = template.definitions;
            context.bindAttributes();
            $("#" + context.getId('ulDefinition')).find(".repeat-row:first").click();
            if (context.editTemplate && context.template_id) {
                $('#' + context.controlId).find('.no-change-class').addClass('disableActive');

            }
        }
    }

    formBuilder.prototype.bindTemplateName = function (template_name, template_key, final_status, result_status, template_type, feature_id, excluded_from_entity, mark_as_center_line, definitionList) {
        var context = this;
        if (context.isClone) {
            template_name = context.cloneTemplateName;
            template_key = context.template_key;
            context.template_id = "";
            context.tableName = "";
            context.setSubFormIdEmptyForClone(definitionList);
        }
        $("#" + context.getId("template_name")).val(template_name);
        $("#" + context.getId("template_key")).val(template_key);
        $("#" + context.getId("final_status")).val(final_status);
        $("#" + context.getId("result_status")).val(result_status);
        $("#" + context.getId("template_type")).val(template_type);
        $("#" + context.getId("ddl_feature_type")).val(feature_id);
        $("#" + context.getId("excludeFromPartition")).prop('checked', excluded_from_entity);
        $("#" + context.getId("markAsCenterLine")).prop('checked', mark_as_center_line);
        final_status = final_status?.split(',');
        context.finalStatus = Array.isArray(final_status) ? final_status : [];
        context.bindTemplateInitialResult();
    }

    formBuilder.prototype.getAttributeContainer = function () {
        var context = this;
        var $attrList = context.createAttributeProductWise();
        var $container = $('<div>', {
            id: context.getId('parent_attribute_container'),
            class: 'column lib-col-3 dragable-controls lib-position-relative no-change-class lib-gray-border-rounded-bg lib-box-sizing lib-column-size-25 p-0'
        });

        var accordionWrapper = $('<div>', {
            class: 'lib-accordion-content screen-full-height-seventy-five custom-scrollbar active',
            id: context.getId('attribute_container')
        }).append($attrList);
        $container.append(accordionWrapper);
        return $container;
    }

    formBuilder.prototype.createAttributeProductWise = function () {
        var context = this;
        var $attrList = $('<ul>', {
            id: context.getId('ulAttribute'),
            class: 'dragable-control-wrapper p-0 lib-border-none lib-icon-list-box'
        });
        if (context.setting.formControls && context.setting.formControls.length > 0) {
            (context.setting.formControls).sort();
            return context.getControlsByFormControls($attrList);
        } else {
            return context.getAllControls($attrList);
        }
    }

    formBuilder.prototype.getControlsByFormControls = function ($attrList) {
        var context = this;
        var controlTypes = {
            "action": context.createActionAttribute,
            "autonumber": context.createAutoNumberAttribute,
            "transaction": context.createTransactionAttribute,
            "relationaldatainput": context.createRelationalDataInputAttribute,
            "additionalinfo": context.createAdditionalInfoAttribute,
            "formtitle": context.createFormTitleAttribute,
            "checkbox": context.createCheckboxAttribute,
            "checkpoint": context.createCheckpointAttribute,
            "coordinate": context.createCoordinateAttribute,
            "calculatedfields": context.createCalculatedFieldsAttribute,
            "date": context.createSelectDateAttribute,
            "datetime": context.createSelectDateAndTimeAttribute,
            "decimal": context.createDecimalAttribute,
            "divider": context.createDividerAttribute,
            "dropdown": context.createDropDownAttribute,
            "autopopulated": context.createFieldAttribute,
            "fileupload": context.createAttachmentAttribute,
            "form": context.createFormAttribute,
            "grid": context.createGridAttribute,
            "heading": context.createHeadingAttribute,
            "evaluationresult": context.createEvaluationResultAttribute,
            "number": context.createNumberAttribute,
            "radio": context.createRadioAttribute,
            "scanner": context.createScannerAttribute,
            "table": context.createTableAttribute,
            "template": context.createTemplateAttribute,
            "textarea": context.createTextareaAttribute,
            "text": context.createTextAttribute,
            "actionform": context.createActionFormAttribute,
            "matrix": context.createMatrixAttribute,
            "signatory": context.createSignatoryAttribute,
            "evaluation": context.createEvaluationAttribute(),
            "user": context.createUserAttribute()
        };

        $.each(context.setting.formControls, function (ind, value) {
            var lowerCaseValue = value.toLowerCase();
            var createControl = controlTypes[lowerCaseValue];
            if (createControl) {
                var control = createControl.call(context);
                $attrList.append(control);
            }
        });

        return $attrList;
    };


    formBuilder.prototype.getControlsForPipetrack = function ($attrList) {
        var context = this;
        var text = context.createTextAttribute();
        var number = context.createNumberAttribute();
        return $attrList.append(text, number);
    }

    formBuilder.prototype.getControlsForStack = function ($attrList) {
        var context = this;
        var text = context.createTextAttribute();
        var textarea = context.createTextareaAttribute();
        var number = context.createNumberAttribute();
        var decimal = context.createDecimalAttribute();
        var dropDown = context.createDropDownAttribute();
        var action = context.createActionAttribute();
        var autonumber = context.createAutoNumberAttribute();
        var calculatedFields = context.createCalculatedFieldsAttribute();
        var transaction = context.createTransactionAttribute();
        var relationalDataInput = context.createRelationalDataInputAttribute();
        var additionalInfo = context.createAdditionalInfoAttribute();
        var radio = context.createRadioAttribute();
        var formTitle = context.createFormTitleAttribute();
        var fileUpload = context.createAttachmentAttribute();
        var selectDate = context.createSelectDateAttribute();
        var dateTime = context.createSelectDateAndTimeAttribute();
        var checkbox = context.createCheckboxAttribute();
        var heading = context.createHeadingAttribute();
        var checkpoint = context.createCheckpointAttribute();
        var calculatedFields = context.createCalculatedFieldsAttribute();
        var form = context.createFormAttribute();
        var field = context.createFieldAttribute();
        var scanner = context.createScannerAttribute();
        var coordinate = context.createCoordinateAttribute();
        var template = context.createTemplateAttribute();
        var grid = context.createGridAttribute();
        var divider = context.createDividerAttribute();
        var table = context.createTableAttribute();
        var actionForm = context.createActionFormAttribute();
        var matrix = context.createMatrixAttribute();
        var signatory = context.createSignatoryAttribute();
        return $attrList.append(action, actionForm, autonumber, additionalInfo, calculatedFields, checkbox, checkpoint, coordinate, dateTime, decimal, divider, dropDown, field, fileUpload, form, formTitle, grid, heading, number, radio, relationalDataInput, scanner, selectDate, table, template, textarea, text, transaction, matrix, signatory);
    }

    formBuilder.prototype.getAllControls = function ($attrList) {
        var context = this;
        var text = context.createTextAttribute();
        var textarea = context.createTextareaAttribute();
        var number = context.createNumberAttribute();
        var decimal = context.createDecimalAttribute();
        var dropDown = context.createDropDownAttribute();
        var action = context.createActionAttribute();
        var autonumber = context.createAutoNumberAttribute();
        var transaction = context.createTransactionAttribute();
        var relationalDataInput = context.createRelationalDataInputAttribute();
        var additionalInfo = context.createAdditionalInfoAttribute();
        var radio = context.createRadioAttribute();
        var formTitle = context.createFormTitleAttribute();
        var fileUpload = context.createAttachmentAttribute();
        var selectDate = context.createSelectDateAttribute();
        var dateTime = context.createSelectDateAndTimeAttribute();
        var checkbox = context.createCheckboxAttribute();
        var heading = context.createHeadingAttribute();
        var evaluationresult = context.createEvaluationResultAttribute();
        var checkpoint = context.createCheckpointAttribute();
        var form = context.createFormAttribute();
        var field = context.createFieldAttribute();
        var scanner = context.createScannerAttribute();
        var coordinate = context.createCoordinateAttribute();
        var calculatedFields = context.createCalculatedFieldsAttribute();
        var template = context.createTemplateAttribute();
        var grid = context.createGridAttribute();
        var divider = context.createDividerAttribute();
        var table = context.createTableAttribute();
        var actionForm = context.createActionFormAttribute();
        var matrix = context.createMatrixAttribute();
        var location = context.createLocationAttribute();
        var signatory = context.createSignatoryAttribute();
        var user = context.createUserAttribute();
        var basicHeading = context.basicHeading();
        var mediaHeading = context.mediaHeading();
        var embeddedHeading = context.embeddedHeading();
        var advanceHeading = context.advanceHeading();
        var evaluation = context.createEvaluationAttribute();
        var user = context.createUserAttribute();
        return $attrList.append(basicHeading, autonumber, checkbox, selectDate, dateTime, decimal, divider, dropDown, formTitle, grid, heading, location, number, radio, scanner, table, text, textarea, user, mediaHeading, fileUpload, signatory, embeddedHeading, action, actionForm, form, advanceHeading, additionalInfo, field, calculatedFields, checkpoint, coordinate, evaluation, evaluationresult, matrix, relationalDataInput, template, transaction);
    }

    formBuilder.prototype.basicHeading = function () {
        return $('<li>', {
            class: 'lib-heading-attr',
            text: _common.getLocalizedValue('LBL_BASIC')
        });
    }

    formBuilder.prototype.mediaHeading = function () {
        return $('<li>', {
            class: 'lib-heading-attr',
            text: _common.getLocalizedValue('LBL_MEDIA')
        });
    }

    formBuilder.prototype.embeddedHeading = function () {
        return $('<li>', {
            class: 'lib-heading-attr',
            text: _common.getLocalizedValue('LBL_EMBEDDED_FORMS')
        });
    }

    formBuilder.prototype.advanceHeading = function () {
        return $('<li>', {
            class: 'lib-heading-attr',
            text: _common.getLocalizedValue('LBL_ADVANCE')
        });
    }

    formBuilder.prototype.createTextAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'text',
            label: _common.getLocalizedValue('LBL_TEXT'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_TEXT') + '</span> <span class="lib-border-rounded lib-input-field-text-icon"></span></div>'
        });
    }
    formBuilder.prototype.createFormAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'form',
            'data-subtype': 'form',
            label: _common.getLocalizedValue('LBL_FORM'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_FORM') + '</span> <span class="lib-border-rounded lib-input-field-form-icon"></span></div>'
        });
    }

    formBuilder.prototype.createNumberAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'number',
            label: _common.getLocalizedValue('LBL_NUMBER'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_NUMBER') + '</span><span class="lib-border-rounded lib-input-field-number-icon"></span></div>'
        });
    }
    formBuilder.prototype.createDecimalAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'decimal',
            label: _common.getLocalizedValue('LBL_DECIMAL'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_DECIMAL') + '</span><span class="lib-border-rounded lib-input-field-decimal-icon"></span></div>'
        });
    }
    formBuilder.prototype.createHeadingAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'heading',
            label: _common.getLocalizedValue('LBL_HEADING'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_HEADING') + '</span><span class="lib-border-rounded lib-input-field-heading-icon"></span></div>'
        });
    }

    formBuilder.prototype.createEvaluationResultAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'evaluationresult',
            label: _common.getLocalizedValue('LBL_EVALUATION_RESULT'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_EVALUATION_RESULT') + '</span><span class="lib-border-rounded lib-input-field-evaluation-result-icon"></span></div>'
        });
    };

    formBuilder.prototype.createAutoNumberAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'autonumber',
            label: _common.getLocalizedValue('LBL_AUTO_NUMBER'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_AUTO_NUMBER') + '</span><span class="lib-border-rounded lib-input-field-number-icon"></span></div>'
        });
    }

    formBuilder.prototype.createCalculatedFieldsAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'calculatedfields',
            label: _common.getLocalizedValue('LBL_CALCULATED_FIELDS'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_CALCULATED_FIELDS') + '</span><span class="lib-border-rounded lib-input-field-number-icon"></span></div>'
        });
    }

    formBuilder.prototype.createTransactionAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'transaction',
            label: _common.getLocalizedValue('LBL_TRANSACTION'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_TRANSACTION') + '</span><span class="lib-border-rounded lib-input-field-transactions-icon"></span></div>'
        });
    }

    formBuilder.prototype.createRelationalDataInputAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'select',
            'data-subtype': 'rdi',
            label: _common.getLocalizedValue('LBL_RDI'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_RDI') + '</span><span class="lib-border-rounded lib-input-field-stencil-icon"></span></div>'
        });
    }

    formBuilder.prototype.createAdditionalInfoAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'additionalinfo',
            label: _common.getLocalizedValue('LBL_ADDITIONAL_INFO'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_ADDITIONAL_INFO') + '</span><span class="lib-border-rounded lib-input-field-additionalinfo-icon"></span></div>'
        });
    }

    formBuilder.prototype.createFormTitleAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'formTitle',
            'data-subtype': 'formTitle',
            label: _common.getLocalizedValue('LBL_FORM_HEADER'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_FORM_HEADER') + '</span> <span class="lib-border-rounded lib-input-field-formheader-icon"></span></div>'
        });
    }

    formBuilder.prototype.createSelectDateAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'date',
            label: _common.getLocalizedValue('LBL_DATE'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_DATE') + '</span><span class="lib-border-rounded lib-input-field-calendar-icon"></span></div>'
        });
    }

    formBuilder.prototype.createDropDownAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'select',
            'data-subtype': 'select',
            label: _common.getLocalizedValue('LBL_DROPDOWN'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_DROPDOWN') + '</span><span class="lib-border-rounded lib-input-field-dropdown-icon"></span></div>'
        });
    }
    formBuilder.prototype.createAttachmentAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'file',
            label: _common.getLocalizedValue('LBL_FILE_UPLOAD'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_FILE_UPLOAD') + '</span><span class="lib-border-rounded lib-input-field-upload-icon"></span></div>'
        });
    }
    formBuilder.prototype.createTextareaAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'textArea',
            label: _common.getLocalizedValue('LBL_TEXT_AREA'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_TEXT_AREA') + '</span> <span class="lib-border-rounded lib-input-field-textarea-icon"></span></div>'
        });
    }
    formBuilder.prototype.createDividerAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'divider',
            label: _common.getLocalizedValue('LBL_DIVIDER'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_DIVIDER') + '</span> <span class="lib-border-rounded lib-input-field-divider-icon"></span></div>'
        });
    }
    formBuilder.prototype.createFieldAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'autoPopulated',
            label: _common.getLocalizedValue('LBL_AUTO_POPULATED'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_AUTO_POPULATED') + '</span> <span class="lib-border-rounded lib-input-field-field-icon"></span></div>'
        });
    }
    formBuilder.prototype.createGridAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'grid',
            label: _common.getLocalizedValue('LBL_GRID'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_GRID') + '</span> <span class="lib-border-rounded lib-input-field-grid-icon"></span></div>'
        });
    }

    formBuilder.prototype.createTableAttribute = function () {

        return $('<li>', {

            class: 'dragable  px-0',

            'data-type': 'table',

            'data-subtype': 'table',

            label: _common.getLocalizedValue('LBL_TABLE'),

            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_TABLE') + '</span> <span class="lib-border-rounded lib-input-field-table-icon"></span></div>'

        });

    }
    formBuilder.prototype.createScannerAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'scanner',
            label: _common.getLocalizedValue('LBL_SCANNER'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_SCANNER') + '</span> <span class="lib-border-rounded lib-input-field-qrcode-icon"></span></div>'
        });
    }
    formBuilder.prototype.createScanCodeAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'scancode',
            label: _common.getLocalizedValue('LBL_SCAN_CODE'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_SCAN_CODE') + '</span> <span class="lib-border-rounded lib-input-field-qrcode-icon"></span></div>'
        });
    }
    formBuilder.prototype.createSelectDateAndTimeAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'dateTime',
            label: _common.getLocalizedValue('LBL_DATE_&_TIME'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_DATE_&_TIME') + '</span><span class="lib-border-rounded lib-input-field-calendar-icon"></span></div>'
        });
    }
    formBuilder.prototype.createActionAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'action',
            'data-subtype': 'action',
            label: _common.getLocalizedValue('LBL_ACTION'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_ACTION') + '</span><span class="lib-border-rounded lib-input-field-acton-icon"></span></div>'
        });
    }

    formBuilder.prototype.createActionFormAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'actionForm',
            'data-subtype': 'actionForm',
            label: _common.getLocalizedValue('LBL_ACTION_FORM'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_ACTION_FORM') + '</span><span class="lib-border-rounded lib-input-field-acton-form-icon"></span></div>'
        });
    }

    formBuilder.prototype.createMatrixAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'matrix',
            'data-subtype': 'matrix',
            label: _common.getLocalizedValue('LBL_MATRIX'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_MATRIX') + '</span><span class="lib-border-rounded lib-input-field-matrix-icon"></span></div>'
        });
    }

    formBuilder.prototype.createSignatoryAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'signatory',
            label: _common.getLocalizedValue('LBL_SIGNATORY'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_SIGNATORY') + '</span><span class="lib-border-rounded lib-input-field-signatory-icon"></span></div>'
        });
    }

    formBuilder.prototype.createRadioAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'radio',
            'data-subtype': 'radio',
            label: _common.getLocalizedValue('LBL_RADIO'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_RADIO') + '</span> <span class="lib-border-rounded lib-input-field-radio-icon"></span></div>'
        });
    }

    formBuilder.prototype.createCheckboxAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'checkbox',
            'data-subtype': 'checkbox',
            label: _common.getLocalizedValue('LBL_CHECKBOX'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_CHECKBOX') + '</span> <span class="lib-border-rounded lib-input-field-checkbox-icon"></span></div>'
        });
    }

    formBuilder.prototype.createCommentAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'comment',
            label: getLocalizedValue('LBL_COMMENT'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_COMMENT') + '</span> <span class="lib-border-rounded lib-input-field-comment-icon"></span></div>'
        });
    }

    formBuilder.prototype.createMMAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'mm',
            label: _common.getLocalizedValue('LBL_MM_NO.'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_MM_NO.') + '</span> <span class="lib-border-rounded lib-input-field-mm-number-icon"></span></div>'
        });
    }

    formBuilder.prototype.createCheckpointAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'checkpoint',
            'data-subtype': 'checkpoint',
            label: _common.getLocalizedValue('LBL_CHECK_POINT'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"> <span>' + _common.getLocalizedValue('LBL_CHECK_POINT') + '</span> <span class="lib-border-rounded lib-input-field-checkpoint-icon"></span></div>'
        });
    };

    formBuilder.prototype.createCoordinateAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'coordinate',
            'data-subtype': 'coordinate',
            label: _common.getLocalizedValue('LBL_COORDINATES'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"> <span>' + _common.getLocalizedValue('LBL_COORDINATES') + '</span> <span class="lib-border-rounded lib-input-field-coordinate-icon"></span></div>'
        });
    };

    formBuilder.prototype.createTemplateAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'template',
            'data-subtype': 'template',
            label: _common.getLocalizedValue('LBL_TEMPLATE'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"> <span>' + _common.getLocalizedValue('LBL_TEMPLATE') + '</span> <span class="lib-border-rounded lib-input-field-template-icon"></span></div>'
        });
    };

    formBuilder.prototype.createLocationAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'location',
            label: _common.getLocalizedValue('LBL_LOCATION'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_LOCATION') + '</span><span class="lib-border-rounded lib-input-field-location-icon"></span></div>'
        });
    }

    formBuilder.prototype.createUserAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'user',
            label: _common.getLocalizedValue('LBL_USER'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_USER') + '</span><span class="lib-border-rounded lib-input-field-user-icon"></span></div>'
        });
    }

    formBuilder.prototype.createEvaluationAttribute = function () {
        return $('<li>', {
            class: 'dragable  px-0',
            'data-type': 'text',
            'data-subtype': 'evaluation',
            label: _common.getLocalizedValue('LBL_EVALUATION'),
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"><span>' + _common.getLocalizedValue('LBL_EVALUATION') + '</span><span class="lib-border-rounded lib-input-field-evaluation-icon"></span></div>'
        });
    }

    formBuilder.prototype.getDefinitionContainer = function () {
        var context = this;
        var str = '<div id="' + context.getId('definition_container') + '" class="column lib-col-5 dragable-controls lib-box-sizing pl-3 pr-3 lib-column-size-50 lib-position-relative">';
        str += '<ul  id="' + context.getId('ulDefinition') + '"class ="screen-full-height-seventy-five custom-scrollbar lib-gray-border-rounded-bg-bottom lib-cross-action-container lib-template-canvas-container">';
        str += '</ul>';
        str += '<div id="' + context.getId('noResultsDiv') + '"><div class="lib-template-canvas-container-info">' + _common.getLocalizedValue('LBL_DRAG_AND_DROP_CONTROLS_FROM_THE_LEFT_TO_POPULATE_THE_FORM') + '</div></div>';
        str += '</div>';
        return str;
    }

    formBuilder.prototype.getPropertyContainer = function () {
        var context = this;
        var str = '<div id="' + context.getId('properties_container') + '" class="column lib-col-4 dragable-controls lib-box-sizing lib-column-size-25 lib-position-relative">';
        str += '<ul  id="' + context.getId('ulProperties') + '"class ="screen-full-height-seventy-five custom-scrollbar dragable-control-wrapper lib-gray-border-rounded-bg-bottom lib-default-cursor lib-template-properties-container">';
        str += '</ul>';
        str += '<div id="' + context.getId('noResultsProperties') + '"><div class="lib-template-properties-container-info">' + _common.getLocalizedValue('LBL_SELECT_AN_ATTRIBUTE_TO_CHANGE_THE_SETTINGS_OF_IT') + '</div></div>';
        str += '</div>';
        return str;
    }

    formBuilder.prototype.createAttribute = function () {
        var context = this;
        $(".dragable").draggable({
            helper: "clone",
            revert: 'invalid',
            opacity: "0.5"
        });
        $("#" + context.getId("ulDefinition")).droppable({
            accept: $(".dragable"),
            hoverClass: "dropHover",
            drop: function (ev, ui) {
                if ($(ui.draggable).hasClass("sortableDiv")) {
                    return;
                }
                var source = $(ui.draggable);
                var type = $(ui.draggable).attr('data-type');
                var label = $(ui.draggable).attr('label');
                var subType = $(ui.draggable).attr('data-subtype');
                var parentDef = $(ui.draggable).attr('data-parentDef');
                var parentTemp = $(ui.draggable).attr('data-parentTemp');
                var parentSubType = $(ui.draggable).attr('parent-subtype');

                if (type == "formTitle") {
                    if (context.filter(context.definitionList, { type: "formTitle" }).length > 0) {
                        context.msgList.push("Form Title already added");
                        context.bindMessage('WARNING');
                        return;
                    }
                }
                var id = context.createIdOfAttribute(subType);
                context.processAttributes(id, label, type, subType, parentDef, parentTemp, parentSubType);
                $("#" + context.getId(id)).trigger("click");
            }
        });
        $("#" + context.getId("ulDefinition")).sortable({
            cancel: ".nonSortableDiv",
            items: "li:not(.nonSortableDiv)",
            update: function (event, ui) {
                context.reorderList(context);
            }
        });
    }

    formBuilder.prototype.isCommentAlreadyAdded = function () {
        var context = this;
        return context.definitionList.some(definition => definition.subType === "comment");
    }
    formBuilder.prototype.isMMNumberAlreadyAdded = function () {
        var context = this;
        return context.definitionList.some(definition => definition.subType === "mm");
    }


    formBuilder.prototype.createIdOfAttribute = function (type) {
        var context = this;
        var id;
        var counterKey = (type === 'text' || type === 'file' || type === 'radio' || type === 'checkbox' || type === 'select' || type === 'textArea' || type === 'heading' || type === 'label') ? 's' : (type === 'rdi') ? 'rdi' : (type === 'number') ? 'n' : (type === 'decimal') ? 'nd' : (type === 'comment') ? 'cc' : (type === 'mm') ? 'mm' : (type === 'checkpoint') ? 'cp' : (type === 'date' || type === 'dateTime') ? 'd' : (type === 'form') ? 'f' : (type === 'autoPopulated' || type === 'formTitle') ? 'fi' : (type === 'grid') ? 'g' : (type === 'scanner' || type === 'scancode') ? 'sc' : (type === 'divider') ? 'di' : (type === 'autonumber') ? 'a' : (type === 'transaction') ? 'tr' : (type === 'additionalinfo') ? 'ai' :
            (type === 'coordinate') ? 'co' : (type === 'template') ? 'te' : (type === 'lookup') ? 'l' : (type === 'table') ? 't' : (type === 'actionForm') ? 'af' : (type === 'calculatedfields') ? 'cf' : (type === 'location') ? 'loc' : (type === 'matrix') ? 'ma' : (type === 'signatory') ? 'sig' : (type === 'contextLabel') ? 'cl' : (type === 'user') ? 'u' : (type === 'evaluationresult') ? 'evr' : (type === 'evaluation') ? 'ev' : null

        if (counterKey) {
            var counter = (context.next_seq[counterKey]) ? context.next_seq[counterKey] + 1 : 1;
            context.next_seq[counterKey] = counter;
            id = counterKey + counter;
        } else if (type === 'action') {
            var data = context.filter(context.definitionList, { type: type });
            id = context.getUUID();
        }

        return id;
    };

    formBuilder.prototype.reorderList = function (context) {
        var listItems = $("#" + context.getId("ulDefinition") + " li");
        var sortedList = [];
        listItems.each(function (idx, li) {
            var id = $(li).attr("data-id");
            var data = context.filter(context.definitionList, { id: id })[0];
            if (data) {
                sortedList.push(data);
            }
        });
        context.definitionList = [];
        context.definitionList = sortedList;
        context.bindAttributes();
    }

    formBuilder.prototype.getUUID = function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    formBuilder.prototype.filter = function (my_object, filterBy) {
        return my_object.filter(function (obj) {
            return Object.keys(filterBy).every(function (c) {
                return obj[c] == filterBy[c];
            });
        });
    }
    formBuilder.prototype.processAttributes = function (id, label, type, subType, parentDef, parentTemp, parentSubType) {
        var context = this;
        var jsonData = context.getDefinition(id, label, type, subType, parentDef, parentTemp, parentSubType);
        context.definitionList.push(jsonData);
        context.sortDefnList();
        context.bindAttributes();
    }

    formBuilder.prototype.getTemplateMetadata = function () {
        var context = this;
        var postData = {};
        postData.template_id = context.template_id;
        postData.project = context.metaData.projectId;
        postData.product = context.product;
        postData.module = context.module;
        context.toggleLoader(1);
        formBuilder.post(context.host.anarServiceUrl + 'api/gettemplatemetadata', postData, function (result) {
            context.toggleLoader(0);
            context.templateMetadata = result.data;
            context.definition = result.data.definitionModel;
            context.templateList = result.data.templateList;
            context.statusList = result.data.statusList;
            context.lovList = result.data.lovList;
            context.userGroupData = result.data.userGroupList;
            context.dropDownFormList = result.data.dropDownFormList;
            if (result.data.templateDetails && result.data.templateDetails != null) {
                context.feature_id = result.data.templateDetails.feature_id;
            }
            context.createContainer();
            result.data.redirectedTemplates && result.data.redirectedTemplates.length > 0 ? context.bindRedirectedControls(result.data.redirectedTemplates) : null;
            context.createAttribute();
            context.bindGlobalEvent();
            context.bindTemplateFinalResult();
            context.bindFeatureType(result.data.featureList);
            if (context.template_id != "" && context.template_id != undefined) {
                context.getTemplateData();
            }
            else if (context.definitionList.length > 0 && !context.template_id) {
                context.bindAttributes();
            }
            if (context.feature_id) {
                $("#" + context.getId("ddl_feature_type")).val(context.feature_id);
            }
        });
    }

    formBuilder.prototype.bindRedirectedControls = function (redirectedTemplates) {
        var context = this;
        var redirectWrapper = $("<div>").addClass("screen-max-height-25 custom-scrollbar lib-overflow-x").attr("id", context.getId('redirected_wrapper'));
        var container = $("#" + context.getId('attribute_container_redirected')).append(redirectWrapper);
        var ul = $('<ul>', {
            id: context.getId('containerUlAttribute'),
            class: 'dragable-control-wrapper p-0 lib-border-none lib-icon-list-box'
        }).appendTo(redirectWrapper);
        redirectedTemplates.forEach(template => {
            for (const key in template.definitions) {
                ul.append(context.createContextLabelAttribute(template, key));
            };
        });
    }

    formBuilder.prototype.createContextLabelAttribute = function (template, key) {
        var iconClass = this.getIconName(template.definitions[key].subType);
        return $('<li>', {
            class: 'dragable px-0',
            'data-type': 'contextLabel',
            'data-subtype': 'contextLabel',
            'data-parentTemp': template.templateId,
            'data-parentDef': key,
            label: template.definitions[key].label,
            'parent-subtype': template.definitions[key].subType,
            html: '<div class="lib-form-control lib-field-bg lib-form-icon"> <span> ' + template.definitions[key].label + '</span><span class="lib-border-rounded lib-input-field-' + iconClass + '-icon"></span></div>'
        });
    };

    formBuilder.prototype.getLovList = function (id) {
        var context = this;
        context.toggleLoader(1);
        context.getApiData(context.host.anarServiceUrl + 'api/getLov/' + context.metaData?.projectId, function (result) {
            context.toggleLoader(0);
            context.lovList = result.data;
            context.bindLovDropDown(id);
            context.bindLovDropDownForCheckbox(id);
            context.bindLovDropDownForRadio(id);
            context.bindLovDropDownForCheckpoint(id);
            context.bindLovDropDownForEvaluation(id);
            $("#" + context.getId("ddlDropdownBox")).val(id).trigger('click');
            context.savePropertyData();
        });
    }

    formBuilder.prototype.getDefinition = function (id, label, type, subType, parentDef, parentTemp, parentSubType) {
        var context = this;
        var configDef = JSON.parse(JSON.stringify(context.definition));
        configDef.id = id;
        configDef.label = label;
        configDef.type = type;
        configDef.subType = subType;
        configDef.constraint = subType == "mm" ? "M" : "";
        configDef.configProperties = {};
        configDef.actionProperties = {};
        configDef.regex = context.getRegex(subType);
        if (parentDef && parentTemp) {
            configDef.configProperties["parentDef"] = parentDef;
            configDef.configProperties["parentTemp"] = parentTemp;
            configDef.configProperties["parentSubType"] = parentSubType;
        }
        return configDef;
    }

    formBuilder.prototype.getRegex = function (subType) {
        var context = this;
        var regex = "";
        if (subType == "number") {
            regex = "^[0-9]*$";
        }
        else if (subType == "decimal") {
            regex = "^[-+]?[0-9]+(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?$";
        }
        return regex;
    }


    formBuilder.prototype.sortDefnList = function () {
        var context = this;
        var actionList = [];
        var actionControl = [];
        for (var i = 0; i < context.definitionList.length; i++) {
            var sortData = context.definitionList[i];
            if (sortData.type === "formTitle") {
                actionList.unshift(sortData);
            } else if (sortData.type === "action") {
                actionControl.push(sortData);
            } else {
                actionList.push(sortData);
            }
        }
        context.definitionList = actionList.concat(actionControl);
    };

    formBuilder.prototype.bindAttributes = function () {
        var context = this;
        $("#" + context.getId("ulDefinition")).empty();
        var actionDefns = context.filter(context.definitionList, { subType: "action" });
        var actionForms = context.filter(context.definitionList, { subType: "actionForm" });
        for (var i = 0; i < context.definitionList.length; i++) {
            var metaData = context.definitionList[i];
            if (metaData.subType == "text") {
                context.bindTextAttributes(metaData.id, metaData.configProperties?.hidden);
            }
            else if (metaData.subType == "formTitle") {
                context.bindFormTitleAttributes(metaData.id);
            }
            else if (metaData.subType == "number") {
                context.bindNumberAttribute(metaData.id, metaData.configProperties?.hidden);
            }
            else if (metaData.subType == "decimal") {
                context.bindDecimalAttribute(metaData.id, metaData.configProperties?.hidden);
            }
            else if (metaData.subType == "textArea") {
                context.bindTextAreaAttribute(metaData.id);
            }
            else if (metaData.subType == "divider") {
                context.bindDividerAttribute(metaData.id);
            }
            else if (metaData.subType == "heading") {
                context.bindHeadingAttribute(metaData.id);
            }
            else if (metaData.subType == "evaluationresult") {
                context.bindEvaluationResultAttribute(metaData.id);
            }
            else if (metaData.subType == "autonumber") {
                context.bindAutoNumberAttribute(metaData.id);
            }
            else if (metaData.subType == "calculatedfields") {
                context.bindCalculatedFieldAttribute(metaData.id);
            }
            else if (metaData.subType == "transaction") {
                context.bindTransactionAttribute(metaData.id);
            }
            else if (metaData.subType == "rdi") {
                context.bindRelationalDataInputAttribute(metaData.id);
            }
            else if (metaData.subType == "additionalinfo") {
                context.bindAdditionalInfoAttribute(metaData.id);
            }
            else if (metaData.subType == "date") {
                context.bindSelectDateAttribute(metaData.id);
            }
            else if (metaData.subType == "select") {
                context.bindDropDownAttribute(metaData.id);
            }
            else if (metaData.subType == "file") {
                context.bindFileUploadAttribute(metaData.id);
            }
            else if (metaData.subType == "radio") {
                context.bindRadioButtonAttribute(metaData.id);
            }
            else if (metaData.subType == "checkbox") {
                context.bindCheckboxAttribute(metaData.id);
            }
            else if (metaData.subType == "comment") {
                context.bindCommentAttribute(metaData.id);
            }
            else if (metaData.subType == "mm") {
                context.bindMMNumberAttributes(metaData.id);
            }
            else if (metaData.subType == "checkpoint") {
                context.bindCheckpointAttributes(metaData.id);
            }
            else if (metaData.subType == "form") {
                context.bindFormAttribute(metaData.id);
            }
            else if (metaData.subType == "autoPopulated") {
                context.bindFieldAttribute(metaData.id);
            }
            else if (metaData.subType == "grid") {
                context.bindGridAttribute(metaData.id);
            }
            else if (metaData.subType == "scanner") {
                context.bindScannerAttribute(metaData.id);
            }
            else if (metaData.subType == "coordinate") {
                context.bindCoordinateAttribute(metaData.id);
            }
            else if (metaData.subType == "template") {
                context.bindTemplateAttribute(metaData.id);
            }

            else if (metaData.subType == "scancode") {
                context.bindScanAttribute(metaData.id);
            }
            else if (metaData.subType == "table") {
                context.bindTableAttribute(metaData.id);
            }
            else if (metaData.subType == "dateTime") {
                context.bindSelectDateAndTimeAttribute(metaData.id);
            }
            else if (metaData.subType == "contextLabel") {
                context.bindContextLabelAttribute(metaData.id);
            }
            else if (metaData.subType == "matrix") {
                context.bindMatrixAttribute(metaData.id);
            }
            else if (metaData.subType == "location") {
                context.bindLocationAttribute(metaData.id);
            }
            else if (metaData.subType == "signatory") {
                context.bindSignatoryAttribute(metaData.id);
            }
            else if (metaData.subType == "user") {
                context.bindUserAttribute(metaData.id);
            }
            else if (metaData.subType == "evaluation") {
                context.bindEvaluationAttribute(metaData.id);
            }
            context.bindProperties(metaData.id);
            context.bindPropertiesData(metaData.id);
        }
        context.bindActionListContainer();
        context.bindFormActionListContainer();
        for (var i = 0; i < actionDefns.length; i++) {
            var metaData = actionDefns[i];
            context.bindActionAttribute(metaData.id);
        }
        actionForms.forEach(action => {
            context.bindFormActionAttribute(action.id);
        })
        context.bindInitialEvent();
        context.changeLabel();
        context.checkResults();
        context.checkPropertyResults();
    }

    formBuilder.prototype.canvasUpdateVisibility = function () {
        var context = this;
        var $ulElement = $("#" + context.getId('ulDefinition'));
        var $noResultsDiv = $("#" + context.getId('noResultsDiv'));
        if ($ulElement.children('li').length === 0) {
            $noResultsDiv.removeClass('hidden');
        } else {
            $noResultsDiv.addClass('hidden');
        }
    }

    formBuilder.prototype.checkResults = function () {
        var context = this;
        var $ulElement = $("#" + context.getId('ulDefinition'));
        context.canvasUpdateVisibility();
        var observer = new MutationObserver(function (mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    context.canvasUpdateVisibility();
                    break;
                }
            }
        });
        observer.observe($ulElement[0], { childList: true });
    }

    formBuilder.prototype.propertyUpdateVisibility = function () {
        var context = this;
        var $ulElement = $("#" + context.getId('ulProperties'));
        var $noResultsDiv = $("#" + context.getId('noResultsProperties'));
        if ($ulElement.children('li').length === 0) {
            $noResultsDiv.removeClass('hidden');
        } else {
            $noResultsDiv.addClass('hidden');
        }
    }

    formBuilder.prototype.updateSpatialFieldsBasedOnCoordinateType = function () {
        var context = this;
        var existingCoordinate = context.definitionList.filter(def => def.subType == "coordinate")[0];
        var coordinateType = $("#" + context.getId('radioBtnDiv')).find('input[name="coordinate"]:checked').val();
        var pointStyleDiv = $("#" + context.getId("pointStyleDiv")).closest('li');
        var lineStyleDiv = $("#" + context.getId("lineStyleDiv")).closest('li');
        if (coordinateType === 'LINE') {
            pointStyleDiv.hide();
            lineStyleDiv.show();
            $("#" + context.getId("spatialColorInput")).val('').prop('disabled', false);
            $("#" + context.getId('lineStyleSelect')).val(existingCoordinate.configProperties?.spatialStyle || '');
            $("#" + context.getId('spatialColorInput')).val(existingCoordinate.configProperties?.spatialColor || '');
            $("#" + context.getId('spatialWidthInput')).val('');
        } else if (coordinateType === 'POINT') {
            pointStyleDiv.show();
            lineStyleDiv.hide();
            context.updateColorForCrossSpatialStyle();
            $("#" + context.getId('spatialStyleInput')).val(existingCoordinate.configProperties?.spatialStyle || '');
            $("#" + context.getId('spatialWidthInput')).val('');
            $("#" + context.getId("spatialColorInput")).val(existingCoordinate.configProperties?.spatialColor || '').prop('disabled', false);

        }
    }

    formBuilder.prototype.updateColorForCrossSpatialStyle = function () {
        var context = this;
        var spatialStyle = $("#" + context.getId("spatialStyleInput")).val();
        var colorInput = $("#" + context.getId("spatialColorInput"));

        if (spatialStyle === 'cross') {
            colorInput.val('#000000').prop('disabled', true);
        } else {
            colorInput.prop('disabled', false);
        }
    }

    formBuilder.prototype.resetStyle = function () {
        var context = this;
        var coordinateDefs = context.definitionList.filter(def => def.subType == "coordinate");
        coordinateDefs.forEach(def => {
            if (def.configProperties.coordinateType == "POINT") {
                def.configProperties.spatialStyle = $("#" + context.getId("spatialStyleInput")).val()?.trim();
            } else if (def.configProperties.coordinateType == "LINE") {
                def.configProperties.spatialStyle = $("#" + context.getId("lineStyleInput")).val()?.trim();
            }
        });
    }

    formBuilder.prototype.resetColorCode = function () {
        var context = this;
        var coordinateDefs = context.definitionList.filter(def => def.subType == "coordinate");
        coordinateDefs.forEach(def => {
            def.configProperties.spatialColor = $("#" + context.getId("spatialColorInput")).val()?.trim();
        });
    }

    formBuilder.prototype.checkPropertyResults = function () {
        var context = this;
        var $ulElement = $("#" + context.getId('ulProperties'));
        context.propertyUpdateVisibility();
        var observer = new MutationObserver(function (mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    context.propertyUpdateVisibility();
                    break;
                }
            }
        });
        observer.observe($ulElement[0], { childList: true });
    }

    formBuilder.prototype.getIconName = function (subType) {
        var iconClass = (subType == "date" || subType == "dateTime") ? "calendar" : (subType == "select") ? "dropdown" : (subType == "textArea") ? "textarea" : subType;
        return iconClass;
    }

    formBuilder.prototype.bindTextAttributes = function (id, flag) {
        var context = this;
        context.componentId = id;
        var classRemoveAdd = flag ? "hiddenActive" : '';
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv ' + classRemoveAdd + '" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-text-icon-dark">Text</label><input type="text" disabled="disabled" placeholder="' + _common.getLocalizedValue('LBL_TEXT') + '" class="lib-form-control"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindFormAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-form-icon-dark">Form</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_FORM') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindRadioButtonAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-radio-icon-dark">Radio</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_RADIO') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindCheckboxAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-checkbox-icon-dark">checkbox</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_CHECKBOX') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindTextAreaAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-textarea-icon-dark">Text Area</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_TEXT_AREA') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }
    formBuilder.prototype.bindDividerAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-divider-icon-dark">Divider</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_DIVIDER') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }
    formBuilder.prototype.bindFieldAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id="' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title="' + _common.getLocalizedValue('LBL_DELETE') + '" id="' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div><label class="lib-form-label lib-prop-title lib-input-field-field-icon-dark">Field</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_AUTO_POPULATED') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }
    formBuilder.prototype.bindMatrixAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-matrix-icon-dark">Field</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_MATRIX') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindGridAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-grid-icon-dark">Grid</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_GRID') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindContextLabelAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var def = context.filter(context.definitionList, { id, id })[0];
        var iconClass = context.getIconName(def.configProperties.parentSubType);
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-' + iconClass + '-icon-dark">Context Label</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_CONTEXT_LABEL') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindTableAttribute = function (id) {

        var context = this;
        context.componentId = id;
        console.log("id", this);

        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-table-icon-dark">Table</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_TABLE') + '"></li>';

        $("#" + context.getId("ulDefinition")).append(definitionStr);

    }

    formBuilder.prototype.bindScannerAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-qrcode-icon-dark">Scanner</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_SCANNER') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindCoordinateAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-coordinate-icon-dark">Coordinate</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_COORDINATE') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindTemplateAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-template-icon-dark">Template</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_TEMPLATE') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }



    formBuilder.prototype.bindScanAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-qrcode-icon-dark">Scan code</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_SCAN_CODE') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindNumberAttribute = function (id, flag) {
        var context = this;
        context.componentId = id;
        var classRemoveAdd = flag ? "hiddenActive" : '';
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv ' + classRemoveAdd + '" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-number-icon-dark">Number</label><input type="number" disabled="disabled" placeholder="' + _common.getLocalizedValue('LBL_NUMBER') + '" class="lib-form-control"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindDecimalAttribute = function (id, flag) {
        var context = this;
        context.componentId = id;
        var classRemoveAdd = flag ? "hiddenActive" : '';
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv ' + classRemoveAdd + '" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-decimal-icon-dark">Decimal</label><input type="number" disabled="disabled" placeholder="' + _common.getLocalizedValue('LBL_DECIMAL') + '" class="lib-form-control"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }
    formBuilder.prototype.bindHeadingAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-heading-icon-dark">Heading</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_HEADING') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindEvaluationResultAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id="' + context.getId(id) + '" data-id="' + id + '">' +
            '<div class="lib-tool-delete delete-cross no-change-class" title="' + _common.getLocalizedValue('LBL_EVALUATION_RESULT') + '" id="' + context.getId(id) + '" data-id="' + id + '">' +
            '<i class="fa fa-times-circle" aria-hidden="true"></i></div>' +
            '<label class="lib-form-label lib-prop-title lib-input-field-evaluation-result-icon-dark">' + _common.getLocalizedValue('LBL_EVALUATION_RESULT') + '</label>' +
            '<input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_EVALUATION_RESULT') + '">' +
            '</li>';

        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }


    formBuilder.prototype.bindAutoNumberAttribute = function (id, flag) {
        var context = this;
        context.componentId = id;
        var classRemoveAdd = flag ? "hiddenActive" : '';
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv ' + classRemoveAdd + '" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-number-icon-dark">Auto Number</label><input type="number" disabled="disabled" placeholder="' + _common.getLocalizedValue('LBL_AUTO_NUMBER') + '" class="lib-form-control"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindCalculatedFieldAttribute = function (id, flag) {
        var context = this;
        context.componentId = id;
        var classRemoveAdd = flag ? "hiddenActive" : '';
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv ' + classRemoveAdd + '" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-number-icon-dark">Calculated Fields</label><input type="number" disabled="disabled" placeholder="' + _common.getLocalizedValue('LBL_CALCULATED_FIELDS') + '" class="lib-form-control"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindSignatoryAttribute = function (id, flag) {
        var context = this;
        context.componentId = id;
        var classRemoveAdd = flag ? "hiddenActive" : '';
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv ' + classRemoveAdd + '" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-signatory-icon-dark">Signatory</label><input type="number" disabled="disabled" placeholder="' + _common.getLocalizedValue('LBL_SIGNATORY') + '" class="lib-form-control"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindTransactionAttribute = function (id, flag) {
        var context = this;
        context.componentId = id;
        var classRemoveAdd = flag ? "hiddenActive" : '';
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv ' + classRemoveAdd + '" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-transactions-icon-dark">Transaction</label><input type="text" disabled="disabled" placeholder="' + _common.getLocalizedValue('LBL_TRANSACTION') + '" class="lib-form-control"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindRelationalDataInputAttribute = function (id, flag) {
        var context = this;
        context.componentId = id;
        var $li = $('<li>', {
            class: 'lib-form-group repeat-row dfn lib-dfn sortableDiv',
            id: context.getId(id),
            'data-id': id
        });
        var $deleteIcon = $('<div>', {
            class: 'lib-tool-delete delete-cross no-change-class',
            title: _common.getLocalizedValue('LBL_DELETE'),
            id: context.getId(id),
            'data-id': id
        }).html('<i class="fa fa-times-circle" aria-hidden="true"></i>');
        var $label = $('<label>', {
            class: 'lib-form-label  lib-prop-title lib-input-field-stencil-icon-dark',
            text: _common.getLocalizedValue('LBL_RDI')
        });
        var $select = $('<select>', {
            disabled: 'disabled',
            id: 'rdiSelect',
            class: 'lib-form-control'
        }).append('<option value="">Select</option>');

        $li.append($deleteIcon, $label, $select);
        $("#" + context.getId("ulDefinition")).append($li);
    }

    formBuilder.prototype.bindAdditionalInfoAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_ADDITIONAL_INFO') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-additionalinfo-icon-dark">' + _common.getLocalizedValue('LBL_ADDITIONAL_INFO') + '</label><input type="text" disabled="disabled" placeholder="' + _common.getLocalizedValue('LBL_ADDITIONAL_INFO') + '" class="lib-form-control"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindFormTitleAttributes = function (id, flag) {
        var context = this;
        context.componentId = id;
        var classRemoveAdd = flag ? "hiddenActive" : '';
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn nonSortableDiv' + classRemoveAdd + '" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-formheader-icon-dark">Form Title</label><input type="text" disabled="disabled" placeholder="' + _common.getLocalizedValue('LBL_FORM_TITLE') + '" class="lib-form-control"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindSelectDateAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-date-icon-dark">Date</label><input type="text" disabled="disabled" placeholder="' + _common.getLocalizedValue('LBL_DATE') + '" class="lib-form-control"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }
    formBuilder.prototype.bindSelectDateAndTimeAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-date-icon-dark">Date And Time</label><input type="text" disabled="disabled" placeholder="' + _common.getLocalizedValue('LBL_DATE_AND_TIME') + '" class="lib-form-control"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindFileUploadAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div><label class="lib-form-label  lib-prop-title lib-input-field-upload-icon-dark">File Upload</label><input type="text" disabled="disabled" placeholder="' + _common.getLocalizedValue('LBL_FILE_UPLOAD') + '" class="lib-form-control"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindActionAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="repeat-row lib-width-auto" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div><button class="lib-btn-custom lib-line-height-normal lib-rounded-4 lib-form-inline" disabled="disabled" class="lib-form-control">action</button></li>';
        $("#" + context.getId("actionListContainer")).append(definitionStr);
    }

    formBuilder.prototype.bindActionListContainer = function () {
        var context = this;
        var str = '<li class="p-0 lib-border-none lib-fs-1 nonSortableDiv" id= "' + context.getId("actionLi") + '"><ul class="lib-action-buttons-form" id="' + context.getId("actionListContainer") + '"></ul></li>';
        $("#" + context.getId("ulDefinition")).append(str);
    }

    formBuilder.prototype.bindFormActionListContainer = function () {
        var context = this;
        var str = '<li class="p-0 lib-border-none lib-fs-1 nonSortableDiv" id= "' + context.getId("formActionLi") + '"><ul class="lib-action-buttons-form" id="' + context.getId("formActionListContainer") + '"></ul></li>';
        $("#" + context.getId("ulDefinition")).append(str);
    }

    formBuilder.prototype.bindFormActionAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="repeat-row lib-width-auto" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div><button class="lib-btn-custom lib-line-height-normal lib-rounded-4 lib-form-inline" disabled="disabled" class="lib-form-control">Action Form</button></li>';
        $("#" + context.getId("formActionListContainer")).append(definitionStr);
    }

    formBuilder.prototype.bindMMNumberAttributes = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-mm-number-icon-dark">MM No.</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_MM_NO.') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindLocationAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-location-icon-dark">Location</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_LOCATION') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindUserAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-user-icon-dark">User</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_USER') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindCheckpointAttributes = function (id) {
        var context = this;
        context.componentId = id;

        var definitionStr = $('<li>', {
            class: 'lib-form-group repeat-row dfn lib-dfn sortableDiv',
            'data-id': id,
            id: context.getId(id),
        });

        definitionStr.append($('<div>', {
            class: 'lib-tool-delete delete-cross no-change-class',
            title: _common.getLocalizedValue('LBL_DELETE'),
            'data-id': id,
            id: context.getId(id),
        }).html('<i class="fa fa-times-circle" aria-hidden="true"></i>'));

        definitionStr.append($('<label>', {
            class: 'lib-form-label lib-prop-title lib-input-field-checkpoint-icon-dark',
            text: 'Label'
        }));

        var libDisplayFlex = $('<div>', {
            class: 'lib-display-flex'
        });

        var libCol3 = $('<div>', {
            class: 'lib-col-3'
        });

        libCol3.append($('<select>', {
            disabled: 'disabled',
            id: 'ddlSelect',
            class: 'lib-form-control'
        }).html('<option value="">' + _common.getLocalizedValue('LBL_SELECT') + '</option>'));

        var libCol9 = $('<div>', {
            class: 'lib-col-9'
        });

        var ml2Div = $('<div>', {
            class: 'ml-2'
        });

        ml2Div.append($('<input>', {
            type: 'text',
            disabled: 'disabled',
            id: '',
            class: 'lib-form-control'
        }));

        libCol9.append(ml2Div);
        libDisplayFlex.append(libCol3, libCol9);
        definitionStr.append(libDisplayFlex);

        $("#" + context.getId("ulDefinition")).append(definitionStr);
    };

    formBuilder.prototype.bindDropDownAttribute = function (id) {
        var context = this;
        context.componentId = id;

        var $li = $('<li>', {
            class: 'lib-form-group repeat-row dfn lib-dfn sortableDiv',
            id: context.getId(id),
            'data-id': id
        });

        var $deleteIcon = $('<div>', {
            class: 'lib-tool-delete delete-cross no-change-class',
            title: _common.getLocalizedValue('LBL_DELETE'),
            id: context.getId(id),
            'data-id': id
        }).html('<i class="fa fa-times-circle" aria-hidden="true"></i>');

        var $label = $('<label>', {
            class: 'lib-form-label  lib-prop-title lib-input-field-dropdown-icon-dark',
            text: "Dropdown"
        });

        var $select = $('<select>', {
            disabled: 'disabled',
            id: 'ddlSelect',
            class: 'lib-form-control'
        }).append('<option value="">Select</option>');

        $li.append($deleteIcon, $label, $select);
        $("#" + context.getId("ulDefinition")).append($li);
    };

    formBuilder.prototype.bindEvaluationAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-evaluation-icon-dark">User</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_EVALUATION') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindInitialEvent = function () {
        var context = this;
        $("#" + context.getId('ulDefinition')).find(".repeat-row").unbind("click").bind("click", function () {
            $(this).removeClass('lib-error-li');
            context.bindProperties($(this).attr("data-id"));
            context.bindPropertiesData($(this).attr("data-id"));
            context.bindActiveDefn(this, context);
            context.reportLabelBind();
            context.componentId = $(this).attr("data-id");
            var currentComponent = context.getComponent(context.componentId);
            if (currentComponent.subType == "action" || currentComponent.subType == 'date' || currentComponent.subType == 'dateTime' || currentComponent.subType == 'location') {
                context.savePropertyData();
            }
        });
        context.bindLabelClick();
    }
    formBuilder.prototype.bindCommentAttribute = function (id) {
        var context = this;
        context.componentId = id;
        var definitionStr = '<li class="lib-form-group repeat-row dfn lib-dfn sortableDiv" id= "' + context.getId(id) + '" data-id="' + id + '"><div class="lib-tool-delete delete-cross no-change-class" title=' + _common.getLocalizedValue('LBL_DELETE') + ' id= "' + context.getId(id) + '" data-id="' + id + '"><i class="fa fa-times-circle" aria-hidden="true"></i></div> <label class="lib-form-label  lib-prop-title lib-input-field-comment-icon-dark">Text Area</label><input type="text" disabled="disabled" class="lib-form-control" placeholder="' + _common.getLocalizedValue('LBL_COMMENT') + '"></li>';
        $("#" + context.getId("ulDefinition")).append(definitionStr);
    }

    formBuilder.prototype.bindPropertiesData = function (id) {
        var context = this;
        var currentComponent = context.getComponent(id);
        if (currentComponent.subType == "text") {
            context.bindTextPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "textArea") {
            context.bindTextAreaPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "divider") {
            context.bindDivsionPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "number") {
            context.bindNumberPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "decimal") {
            context.bindDecimalPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "heading") {
            context.bindHeadingPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "evaluationresult") {
            context.bindEvaluationResultPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "autonumber") {
            context.bindAutoNumberPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "calculatedfields") {
            context.bindCalculatedFieldPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "transaction") {
            context.bindTransactionPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "rdi") {
            context.bindRelationalDataInputPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "additionalinfo") {
            context.bindAdditionalInfoPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "formTitle") {
            context.bindFormTitlePropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "date") {
            context.bindSelectDatePropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "select") {
            context.bindDropDownPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "file") {
            context.bindFileUploadPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "action") {
            context.bindActionPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "radio") {
            context.bindRadioPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "checkbox") {
            context.bindCheckboxPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "comment") {
            context.bindCommentPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "mm") {
            context.bindMMNumberPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "checkpoint") {
            context.bindCheckpointPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "form") {
            context.bindFormPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "autoPopulated") {
            context.bindFieldPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "grid") {
            context.bindGridPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "scanner") {
            context.bindScannerPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "coordinate") {
            context.bindCoordinatePropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "template") {
            context.bindTemplatePropertiesData(currentComponent);
        }

        else if (currentComponent.subType == "scancode") {
            context.bindScanCodePropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "table") {
            context.bindtableDataProperties(currentComponent);
        }
        else if (currentComponent.subType == "dateTime") {
            context.bindSelectDateAndTimePropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "actionForm") {
            context.bindActionFormPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "contextLabel") {
            context.bindContextLabelPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "matrix") {
            context.bindMatrixPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "location") {
            context.bindLocationPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "signatory") {
            context.bindSignatoryPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "user") {
            context.bindUserPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "evaluation") {
            context.bindEvaluationPropertiesData(currentComponent);
        }
    }

    formBuilder.prototype.bindMatrixPropertiesData = function (currentComponent) {
        var context = this;
        context.selectedDisplayColumn = currentComponent.configProperties.selectedMatrixColumns;
        context.selectedFormList = currentComponent.configProperties.selectedMatrixForms;
        context.onChangeOfMatrixForm(currentComponent);
    }

    formBuilder.prototype.bindLocationPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
        var hasTransaction = context.definitionList && context.definitionList.some(def => def.subType === "transaction");
        var locationType = currentComponent.configProperties.locationType || 'SELECTION';
        if (context.feature_id && context.feature_id === 'MATERIAL') {
            locationType = 'SELECTION';
            $("#" + context.getId('radioBtnDiv')).find('input[name="location"][value="FROMLOCATION"]').prop('disabled', true);
            $("#" + context.getId('radioBtnDiv')).find('input[name="location"][value="TOLOCATION"]').prop('disabled', true);
        }
        if (hasTransaction) {
            if (locationType === 'SELECTION') {
                locationType = '';
            }
            $("#" + context.getId('radioBtnDiv')).find('input[name="location"][value="SELECTION"]').prop('disabled', true);
        }
        if (locationType != '') {
            $("#" + context.getId('radioBtnDiv')).find('input[name="location"]').filter('[value="' + locationType + '"]').prop('checked', true);
        }
    }

    formBuilder.prototype.bindUserPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
        $("#" + context.getId("showInWebId")).prop('checked', currentComponent.configProperties?.showInWeb);
        $("#" + context.getId("showInMobId")).prop('checked', currentComponent.configProperties?.showInMob);
        $("#" + context.getId("mapSystemUser")).prop('checked', currentComponent.configProperties?.mapSystemUser);
        var userDetail = currentComponent.configProperties?.userDetail || 'FIRSTNAME';
        if (userDetail === 'FIRSTNAME') {
            $("#" + context.getId('radioBtnDiv')).find('input[name="userDetail"]').filter('[value="' + userDetail + '"]').prop('checked', true);
        }
        else if (userDetail === 'FIRSTLASTNAME') {
            $("#" + context.getId('radioBtnDiv')).find('input[name="userDetail"]').filter('[value="' + userDetail + '"]').prop('checked', true);
        }
        else if (userDetail === 'EMAILID') {
            $("#" + context.getId('radioBtnDiv')).find('input[name="userDetail"]').filter('[value="' + userDetail + '"]').prop('checked', true);
        }
        context.saveUserPropertiesData(currentComponent);
    }

    formBuilder.prototype.bindEvaluationPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("ddlSelectLovEvaluation")).val(currentComponent.configProperties.lovId);
        $("#" + context.getId("evalScoreLabelId")).val(currentComponent.configProperties.scoreLabel);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("showInWebId")).prop('checked', currentComponent.configProperties?.showInWeb);
        $("#" + context.getId("showInMobId")).prop('checked', currentComponent.configProperties?.showInMob);
    }

    formBuilder.prototype.bindTextPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("defaultValueId")).val(currentComponent.defaultValue);
        $("#" + context.getId("regexId")).val(currentComponent.regex);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
        $("#" + context.getId("excludeFromMobId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.excludeFromMob);
        $("#" + context.getId("hidden")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.hidden);
        $("#" + context.getId("primaryKeyId")).prop('checked', currentComponent.key === "P");
        $("#" + context.getId("uniqueKeyId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.uniqueKey);
        $("#" + context.getId("readonly")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.readonly);
        $("#" + context.getId("showInWebId")).prop('checked', currentComponent.configProperties?.showInWeb);
        $("#" + context.getId("showInMobId")).prop('checked', currentComponent.configProperties?.showInMob);
        $("#" + context.getId("copyId")).prop('checked', currentComponent.configProperties?.copy);
    }

    formBuilder.prototype.bindContextLabelPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
        $("#" + context.getId("excludeFromMobId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.excludeFromMob);
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
    }

    formBuilder.prototype.bindScannerPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
        $("#" + context.getId("autoGeneratedQrId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.autoGeneratedQr);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
    }

    formBuilder.prototype.bindCoordinatePropertiesData = function (currentComponent) {
        var context = this;
        var existingCoordinate = context.definitionList.filter(def => def.subType == "coordinate")[0];
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);

        var spatialStyle = currentComponent.configProperties.spatialStyle?.trim();
        var coordinateType = currentComponent.configProperties?.coordinateType || 'POINT';
        var pointStyleDiv = $("#" + context.getId("pointStyleDiv")).closest('li');
        var lineStyleDiv = $("#" + context.getId("lineStyleDiv")).closest('li');
        $("#" + context.getId("spatialColorInput")).val(existingCoordinate.configProperties?.spatialColor || '').prop('disabled', false);
        if (coordinateType === 'LINE') {
            pointStyleDiv.hide();
            lineStyleDiv.show();
            $("#" + context.getId("lineStyleSelect")).val(spatialStyle);
            $("#" + context.getId("spatialStyleInput")).val(existingCoordinate.configProperties?.spatialStyle || '');
            $("#" + context.getId("spatialColorInput")).val(existingCoordinate.configProperties?.spatialColor || '').prop('disabled', false);
            $("#" + context.getId("spatialWidthInput")).val(currentComponent.configProperties?.spatialWidth || '');
        } else if (coordinateType === 'POINT') {
            pointStyleDiv.show();
            lineStyleDiv.hide();
            $("#" + context.getId("spatialStyleInput")).val(existingCoordinate.configProperties?.spatialStyle || spatialStyle);
            if (spatialStyle === 'cross') {
                $("#" + context.getId("spatialColorInput")).val('#000000').prop('disabled', true);
            } else {
                $("#" + context.getId("spatialColorInput")).val(existingCoordinate.configProperties?.spatialColor || '').prop('disabled', false);
            }
            $("#" + context.getId("spatialWidthInput")).val(currentComponent.configProperties?.spatialWidth || '');

        }
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
        $("#" + context.getId('radioBtnDiv')).find('input[name="coordinate"]').filter('[value="' + coordinateType + '"]').prop('checked', true);
        $("#" + context.getId('radioBtnDiv')).find('input[name="coordinate"]').on('change', function () {
            context.updateSpatialFieldsBasedOnCoordinateType();
        });
    }

    formBuilder.prototype.bindTemplatePropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties?.shortText);
        $("#" + context.getId("excludeFromMobId")).prop('checked', currentComponent.configProperties?.excludeFromMob);
        $("#" + context.getId("templateModule")).val(currentComponent.configProperties?.templateModule);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("showInTemplateWebId")).prop('checked', currentComponent.configProperties?.showInWeb);
    }

    formBuilder.prototype.bindScanCodePropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("ddlScanCodeDataSet")).val(currentComponent.configProperties?.ddlScanCodeDataSet);
    }
    formBuilder.prototype.bindtableDataProperties = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        if (currentComponent.configProperties.columns) {
            $(currentComponent.configProperties.columns).each(function (key, value) {
                context.createColumnsAndRemove(value.id)
                $("#col_" + value.id).val(value.label);
            })
            $(".column-delete-cross").unbind("click").bind("click", function () {
                var deleteId = $(this).attr("data-id");
                $('#' + deleteId).remove();
                context.saveTablePropertyData();
            });
        }

        if (currentComponent.configProperties.rows) {
            $(currentComponent.configProperties.rows).each(function (key, value) {
                context.createRowAndRemove(value.id)
                $("#row_" + value.id).val(value.label);
            })
            $(".row-delete-cross").unbind("click").bind("click", function () {
                var deleteId = $(this).attr("data-id");
                $('#' + deleteId).remove();
                context.saveTablePropertyData();
            });
        }
    }
    formBuilder.prototype.createColumnsAndRemove = function (id) {

        var context = this;

        var $columnLi = $('<li>', {
            "data-id": id,
            id: id,
            class: "lib-form-group lib-position-relative no-change-class new-column-class mb-2 mt-2 lib-column-with-delete-field"
        });

        var $input = $('<input>', {
            type: "text",
            id: "col_" + id,
            class: "lib-form-control"
        });

        var $diceIcon = $('<div>', {
            class: "lib-dice-icon-move"
        })

        var $divCol = $('<div>', {
            class: "lib-tool-delete column-delete-cross no-change-class mr-2",
            "data-id": id,
            title: _common.getLocalizedValue('LBL_DELETE')
        }).append($('<i>', {
            class: "fa fa-times",
            "aria-hidden": "true"
        }));;

        var columns = $columnLi.append($input, $diceIcon, $divCol);

        $("#" + context.getId("tbl_col_div")).addClass("lib-prop-p").append(columns);

    }

    formBuilder.prototype.createRowAndRemove = function (id) {

        var context = this;

        var $rowLi = $('<li>', {
            "data-id": id,
            id: id,
            class: "lib-form-group no-change-class new-row-class mb-2 mt-2 lib-column-with-delete-field"
        });

        var $input = $('<input>', {
            type: "text",
            id: "row_" + id,
            class: "lib-form-control"
        });


        var $diceIcon = $('<div>', {
            class: "lib-dice-icon-move"
        })

        var $divRow = $('<div>', {
            class: "lib-tool-delete row-delete-cross no-change-class mr-2",
            "data-id": id,
            title: _common.getLocalizedValue('LBL_DELETE')
        }).append($('<i>', {
            class: "fa fa-times",
            "aria-hidden": "true"
        }));;

        var rows = $rowLi.append($input, $diceIcon, $divRow);

        $("#" + context.getId("tbl_row_div")).addClass("lib-prop-p").append(rows);

    }


    formBuilder.prototype.bindTextAreaPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("regexId")).val(currentComponent.regex);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
        $("#" + context.getId("excludeFromMobId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.excludeFromMob);
        $("#" + context.getId("showInWebId")).prop('checked', currentComponent.configProperties?.showInWeb);
        $("#" + context.getId("showInMobId")).prop('checked', currentComponent.configProperties?.showInMob);
        $("#" + context.getId("copyId")).prop('checked', currentComponent.configProperties?.copy);
    }

    formBuilder.prototype.bindDivsionPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);

    }
    formBuilder.prototype.bindHeadingPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("ddlheading")).val(currentComponent.configProperties.style);
        $("#" + context.getId("ddlalign")).val(currentComponent.configProperties.align);
        $("#" + context.getId("headingDivider")).prop('checked', currentComponent.configProperties?.divider);
    }

    formBuilder.prototype.bindEvaluationResultPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("showInWebId")).prop('checked', currentComponent.configProperties?.showInWeb);
        $("#" + context.getId("evaluationResultConditions")).empty();

        if (currentComponent.configProperties?.evaluationConditions) {
            currentComponent.configProperties.evaluationConditions.forEach((condition, index) => {
                context.createEvaluationResultConditionRow(condition.score, condition.result, condition.colour, index);
            });
        }

        let totalRows = $("#" + context.getId("evaluationResultConditions")).find("li").length;
        while (totalRows < 3) {
            context.createEvaluationResultConditionRow("", "", "", totalRows);
            totalRows++;
        }
    };

    formBuilder.prototype.bindAutoNumberPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("paddingLengthId")).val(currentComponent.configProperties.paddingLength === "" ? "1" : currentComponent.configProperties.paddingLength);
        $("#" + context.getId("prefixId")).val(currentComponent.configProperties.prefix);
        $("#" + context.getId("postfixId")).val(currentComponent.configProperties.postfix);
        $("#" + context.getId("previewId")).val(currentComponent.configProperties.preview);
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties?.shortText);
        $("#" + context.getId("showInWebId")).prop('checked', currentComponent.configProperties?.showInWeb);
        $("#" + context.getId("primaryKeyId")).prop('checked', currentComponent.key === "P");
        $("#" + context.getId("showInMobId")).prop('checked', currentComponent.configProperties?.showInMob);
        context.updatePreview();
    }

    formBuilder.prototype.bindCalculatedFieldPropertiesData = function (currentComponent) {
        var context = this;
        var expression = currentComponent.configProperties?.expression || "";
        var expressionArr = currentComponent.configProperties?.expressionArr || [];
        var usedColumns = currentComponent.configProperties?.usedColumns || [];
        var dataSource = currentComponent.configProperties?.dataSourceType || "NUMBER";
        var selectId = dataSource === 'NUMBER' ? 'selectNumberFields' : 'selectStringFields';
        var fieldMap = context.createFieldMapping(selectId);
        var formulaDisplayId = dataSource === 'NUMBER' ? 'formulaNumberDisplay' : 'formulaStringDisplay';
        var formulaBuilderDisplayId = dataSource === 'NUMBER' ? 'formulaBuilderNumberDiv' : dataSource == 'STRING' ? 'formulaBuilderStringDiv' : 'calculatedDistanceDiv';

        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("readonly")).prop('checked', true);
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("showInWebId")).prop('checked', currentComponent.configProperties?.showInWeb);
        $("#" + context.getId("showInMobId")).prop('checked', currentComponent.configProperties?.showInMob);
        $("#" + context.getId("copyId")).prop('checked', currentComponent.configProperties?.copy);

        $("#" + context.getId('calculatedRadioBtnDiv')).find('input[name="calculatedDataSource"][value="' + dataSource + '"]').prop('checked', true);
        $("#" + context.getId(formulaBuilderDisplayId)).show();
        $("#" + context.getId(formulaDisplayId)).attr("exp_attr", JSON.stringify(expressionArr));
        $("#" + context.getId(formulaDisplayId)).text(expression.split(',').map(a => fieldMap[a.trim()] || a.trim()).join(' '));

        $("#" + context.getId("selectFormDistance")).val(currentComponent.configProperties?.fromAttribute);
        $("#" + context.getId("selectToDistance")).val(currentComponent.configProperties?.toAttribute);
        $("#" + context.getId("selectMeasurementUnit")).val(currentComponent.configProperties?.measurementUnit);
        $("#" + context.getId('lengthDimension')).find('input[name="lengthDimension"][value="' + currentComponent.configProperties?.dimensionLength + '"]').prop('checked', true);

        context.bindRadioClickEvent(currentComponent, expressionArr, usedColumns);
        context.bindStringSpanClickEvents(currentComponent, expressionArr, usedColumns);
        context.bindNumberSpanClickEvents(currentComponent, expressionArr, usedColumns);

        context.addButtonHandler(currentComponent, 'selectNumberAddBtn', 'NUMBER', expressionArr, usedColumns);
        context.addButtonHandler(currentComponent, 'selectStringAddBtn', 'STRING', expressionArr, usedColumns);
        context.addTextHandler(currentComponent, 'numberInputAddBtn', expressionArr, usedColumns);
        context.addStringHandler(currentComponent, 'stringInputAddBtn', 'STRING', expressionArr, usedColumns);
        context.backButtonHandler(currentComponent, 'numberBackBtn', 'NUMBER', expressionArr, usedColumns);
        context.backButtonHandler(currentComponent, 'stringBackBtn', 'STRING', expressionArr, usedColumns);
    }

    formBuilder.prototype.bindRadioClickEvent = function (currentComponent, expressionArr, usedColumns) {
        var context = this;
        $("#" + context.getId('calculatedRadioBtnDiv')).find('input[name="calculatedDataSource"]').on('change', function () {
            $("#" + context.getId("formulaBuilderNumberDiv")).hide();
            $("#" + context.getId("formulaBuilderStringDiv")).hide();
            $("#" + context.getId("calculatedDistanceDiv")).hide();
            if (currentComponent.configProperties.dataSourceType === 'NUMBER' ? $("#" + context.getId("formulaNumberDisplay")).text().length > 0 : $("#" + context.getId("formulaStringDisplay")).text().length > 0) {
                context.expressionValidation(currentComponent, expressionArr, usedColumns);
            } else {
                context.clearExpression(currentComponent, expressionArr, usedColumns);
            }
        });
    }

    formBuilder.prototype.expressionValidation = function (currentComponent, expressionArr, usedColumns) {
        var context = this;
        var selectedRadioBtn = $('input[name="calculatedDataSource"]:checked').val();
        context.modal(1);
        $("#" + context.getId('modalTitle')).append(_common.getLocalizedValue('LBL_EXPRESSION_VALIDATION'));
        $("#" + context.getId('modalBox')).addClass("lib-modal-sm");
        $("#" + context.getId('modalcontent')).append(_common.getLocalizedValue('LBL_EXPRESSION_REMOVE_CONFIRMATION'));
        $("#" + context.getId('modalFooter')).append($('<button>').addClass('lib-btn-custom lib-rounded-4').attr('id', context.getId('cancelBtnCal')).text(_common.getLocalizedValue('LBL_NO')));
        $("#" + context.getId('modalFooter')).append($('<button>').addClass('lib-btn-custom lib-rounded-4').attr('id', context.getId('saveBtn')).text(_common.getLocalizedValue('LBL_YES')));
        $("#" + context.getId("saveBtn")).unbind("click").bind("click", function () {
            context.clearExpression(currentComponent, expressionArr, usedColumns);
            context.modal(0);
        });
        $("#" + context.getId("cancelBtnCal")).unbind("click").bind("click", function () {
            context.restoreExpression(currentComponent);
            context.modal(0);
        });
        $("#" + context.getId("btnClose")).unbind("click").bind("click", function () {
            context.restoreExpression(currentComponent);
            context.modal(0);
        });
    }

    formBuilder.prototype.clearExpression = function (currentComponent, expressionArr, usedColumns) {
        var context = this;
        context.modal(1);
        expressionArr.length = 0;
        usedColumns.length = 0;
        currentComponent.configProperties.expressionArr = expressionArr ? expressionArr : [];
        currentComponent.configProperties.usedColumns = usedColumns ? usedColumns : [];
        currentComponent.configProperties.dataSourceType = $('input[name="calculatedDataSource"]:checked').val();
        currentComponent.configProperties.expression = '';
        if (currentComponent.configProperties.dataSourceType === 'NUMBER') {
            $("#" + context.getId("formulaBuilderNumberDiv")).show();
            $("#" + context.getId("formulaNumberDisplay")).text('');
            $("#" + context.getId("selectNumberFields")).val('');
            $("#" + context.getId("inputNumberField")).val('');
        } else if (currentComponent.configProperties.dataSourceType === 'DISTANCE') {
            $("#" + context.getId("calculatedDistanceDiv")).show();
            $("#" + context.getId("selectFormDistance")).val('');
            $("#" + context.getId("selectToDistance")).val('');
            $("#" + context.getId("selectMeasurementUnit")).val('');
        } else {
            $("#" + context.getId("formulaBuilderStringDiv")).show();
            $("#" + context.getId("formulaStringDisplay")).text('');
            $("#" + context.getId("selectStringFields")).val('');
            $("#" + context.getId("inputStringField")).val('');
        }
        context.modal(0);
    }

    formBuilder.prototype.restoreExpression = function (currentComponent) {
        var context = this;
        $('input[name="calculatedDataSource"]').not(':checked').prop('checked', true);
        currentComponent.configProperties.dataSourceType = $('input[name="calculatedDataSource"]:checked').val();
        currentComponent.configProperties.expressionArr = currentComponent.configProperties.expressionArr || [];
        currentComponent.configProperties.usedColumns = currentComponent.configProperties.usedColumns || [];
        var selectId = currentComponent.configProperties.dataSourceType === 'NUMBER' ? 'selectNumberFields' : 'selectStringFields';
        var fieldMap = context.createFieldMapping(selectId);
        if (currentComponent.configProperties.dataSourceType === 'NUMBER') {
            $("#" + context.getId("formulaBuilderNumberDiv")).show();
            $("#" + context.getId("formulaNumberDisplay")).text(currentComponent.configProperties.expression.split(',').map(a => fieldMap[a.trim()] || a.trim()).join(' '));
        } else {
            $("#" + context.getId("formulaBuilderStringDiv")).show();
            $("#" + context.getId("formulaStringDisplay")).text(currentComponent.configProperties.expression.split(',').map(a => fieldMap[a.trim()] || a.trim()).join(' '));
        }
    }

    formBuilder.prototype.addButtonHandler = function (currentComponent, btnId, dataType, expressionArr, usedColumns) {
        var context = this;
        $("#" + context.getId(btnId)).off('click').on('click', function () {
            context.addSelectedFields(currentComponent, expressionArr, dataType, usedColumns);
        });
    };

    formBuilder.prototype.backButtonHandler = function (currentComponent, btnId, dataType, expressionArr, usedColumns) {
        var context = this;
        $("#" + context.getId(btnId)).off('click').on('click', function () {
            context.bindBackButtonClick(currentComponent, dataType, expressionArr, usedColumns);
        });
    };

    formBuilder.prototype.createFieldMapping = function (selectedElementId) {
        var context = this;
        var fieldMapping = {};
        $("#" + context.getId(selectedElementId)).find('option').each(function () {
            var option = $(this);
            if (option.attr("ref_attr")) {
                fieldMapping[option.attr("ref_attr")] = option.text();
            }
        });
        return fieldMapping;
    }

    formBuilder.prototype.addSelectedFields = function (currentComponent, expressionArr, dataType, usedColumns) {
        var context = this;
        var formulaDisplayId = dataType === 'NUMBER' ? 'formulaNumberDisplay' : 'formulaStringDisplay';
        var selectId = dataType === 'NUMBER' ? 'selectNumberFields' : 'selectStringFields';
        var selectedValue = $("#" + context.getId(selectId)).find(":selected").attr("ref_attr") ? $("#" + context.getId(selectId)).find(":selected").attr("ref_attr") : "";
        if (selectedValue) {
            expressionArr.push(selectedValue);
            usedColumns.push(selectedValue);
            currentComponent.configProperties.expression = (currentComponent.configProperties.expression && !currentComponent.configProperties.expression.endsWith(',')) ? currentComponent.configProperties.expression + " ," + selectedValue : (currentComponent.configProperties.expression || '') + selectedValue;
            currentComponent.configProperties.expressionArr = expressionArr || [];
            currentComponent.configProperties.usedColumns = usedColumns || [];
            $("#" + context.getId(selectId)).val('');
            context.updateFormulaDisplay(currentComponent, dataType, expressionArr);
            $("#" + context.getId(formulaDisplayId)).attr("exp_attr", JSON.stringify(expressionArr));
        }
    };

    formBuilder.prototype.bindStringSpanClickEvents = function (currentComponent, expressionArr, usedColumns) {
        var context = this;
        $("#" + context.getId('stringClearBtn')).off('click').on('click', function () {
            var span = $(this);
            var fieldMap = context.createFieldMapping('selectStringFields');
            if (span.text().trim() === _common.getLocalizedValue('LBL_CLEAR')) {
                $("#" + context.getId('formulaStringDisplay')).empty();
                expressionArr.length = 0;
                usedColumns.length = 0;
                currentComponent.configProperties.expression = '';
                currentComponent.configProperties.expressionArr = [];
                currentComponent.configProperties.usedColumns = [];
                context.updateFormulaDisplay(currentComponent, 'STRING', expressionArr);
            }
        });

        $("#" + context.getId('spanStringDiv')).off('click', '.clickable').on('click', '.clickable', function () {
            var span = $(this);
            var fieldMap = context.createFieldMapping('selectStringFields');
            $('.clickable').removeClass('selected');
            span.toggleClass('selected');
            var operator = span.text().trim();
            context.bindOperatorClicks(currentComponent, operator, expressionArr);
        });
    }

    formBuilder.prototype.bindNumberSpanClickEvents = function (currentComponent, expressionArr, usedColumns) {
        var context = this;
        $("#" + context.getId('spanNumberClear')).off('click').on('click', function () {
            var span = $(this);
            if (span.text().trim() === _common.getLocalizedValue('LBL_CLEAR')) {
                $("#" + context.getId('formulaNumberDisplay')).empty();
                expressionArr.length = 0;
                usedColumns.length = 0;
                currentComponent.configProperties.expression = '';
                currentComponent.configProperties.expressionArr = [];
                currentComponent.configProperties.usedColumns = [];
                context.updateFormulaDisplay(currentComponent, 'NUMBER', expressionArr);
            }
        });

        $("#" + context.getId('spanNumberDiv')).off('click', '.clickable').on('click', '.clickable', function () {
            var span = $(this);
            $('.clickable').removeClass('selected');
            span.toggleClass('selected');
            var operator = span.text().trim();
            context.bindOperatorClicks(currentComponent, operator, expressionArr);
        });
    }

    formBuilder.prototype.bindBackButtonClick = function (currentComponent, type, expressionArr, usedColumns) {
        var context = this;
        var selectId = type === 'NUMBER' ? 'selectNumberFields' : 'selectStringFields';
        var formulaDisplayId = type === 'NUMBER' ? 'formulaNumberDisplay' : 'formulaStringDisplay';
        expressionArr?.pop();
        usedColumns?.pop();
        currentComponent.configProperties.expressionArr = expressionArr || [];
        currentComponent.configProperties.usedColumns = usedColumns || [];
        currentComponent.configProperties.expression = expressionArr.map(function (id) {
            return $("#" + context.getId(selectId)).find("option[value='" + id + "']").val();
        }).join(", ");
        context.updateFormulaDisplay(currentComponent, type, expressionArr);
        $("#" + context.getId(formulaDisplayId)).attr("exp_attr", JSON.stringify(expressionArr));
    };

    formBuilder.prototype.bindOperatorClicks = function (currentComponent, operator, expressionArr) {
        var context = this;
        var currentType = $("#" + context.getId('formulaBuilderNumberDiv')).is(':visible') ? 'NUMBER' : 'STRING';
        if (currentType === 'NUMBER') {
            expressionArr.push(operator);
            currentComponent.configProperties.expression = currentComponent.configProperties.expression ? currentComponent.configProperties.expression += ", " + operator : currentComponent.configProperties.expression = operator;
            currentComponent.configProperties.expressionArr = expressionArr ? expressionArr : [];
            context.updateFormulaDisplay(currentComponent, 'NUMBER', expressionArr);
        } else {
            if (operator === 'Space') {
                expressionArr.push('Space');
                currentComponent.configProperties.expression = currentComponent.configProperties.expression ? currentComponent.configProperties.expression += ", Space" : currentComponent.configProperties.expression = "Space";
                currentComponent.configProperties.expressionArr = expressionArr ? expressionArr : [];
                context.updateFormulaDisplay(currentComponent, 'STRING', expressionArr);
            } if (operator === '||' || operator === '(' || operator === ')') {
                expressionArr.push(operator);
                currentComponent.configProperties.expression = currentComponent.configProperties.expression ? currentComponent.configProperties.expression += ", " + operator : currentComponent.configProperties.expression = operator;
                currentComponent.configProperties.expressionArr = expressionArr ? expressionArr : [];
                context.updateFormulaDisplay(currentComponent, 'STRING', expressionArr);
            } else {
                expressionArr.push('+');
                currentComponent.configProperties.expression = currentComponent.configProperties.expression ? currentComponent.configProperties.expression += ", +" : currentComponent.configProperties.expression = "+";
                currentComponent.configProperties.expressionArr = expressionArr ? expressionArr : [];
                context.updateFormulaDisplay(currentComponent, 'STRING', expressionArr);
            }
        }
    };

    formBuilder.prototype.updateFormulaDisplay = function (currentComponent, type, expressionArr) {
        var context = this;
        var selectId = type === 'NUMBER' ? 'selectNumberFields' : 'selectStringFields';
        var fieldMap = context.createFieldMapping(selectId);
        var formulaDisplayId = type === 'NUMBER' ? 'formulaNumberDisplay' : 'formulaStringDisplay';
        var expression = expressionArr.map(function (item) {
            if (['If', 'Else', 'Then', 'And', 'Or', 'Not', 'Equal To', 'Not Equal To', 'Greater Than', 'Less Than', 'Greater Than Equal To', 'Less Than Equal To', 'Between'].includes(item) || ["+", "-", "*", "/", "(", ")"].includes(item)) {
                return item.trim();
            } else if (fieldMap[item.trim()]) {
                var selectField = $("#" + context.getId('select' + (type === 'NUMBER' ? 'Number' : 'String') + 'Fields'));
                var optionElement = selectField.find("option[ref_attr='" + item.trim() + "']");
                var refAttr = optionElement.attr("ref_attr");
                if (refAttr) {
                    return refAttr;
                }
            } else {
                return item;
            }
        }).join(",");
        currentComponent.configProperties.expression = expression;
        $("#" + context.getId(formulaDisplayId)).text(expression.split(',').map(a => fieldMap[a.trim()] || a.trim()).join(' '));
        $("#" + context.getId(formulaDisplayId)).attr("exp_attr", JSON.stringify(expressionArr));
        currentComponent.subType === 'number' ? context.saveNumberPropertiesData(context.getComponent(context.componentId)) : currentComponent.subType === 'decimal' ? context.saveDecimalPropertiesData(context.getComponent(context.componentId)) : currentComponent.subType === 'calculatedfields' && context.saveCalculatedFieldPropertiesData(context.getComponent(context.componentId));
    };

    formBuilder.prototype.bindSignatoryPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties?.shortText);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
    }

    formBuilder.prototype.bindTransactionPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        var transactionType = currentComponent.configProperties.transactionType || 'DISPATCH';
        if (transactionType == 'DISPATCH') {
            $("#" + context.getId('transactionBtnDiv')).find('input[name="transaction"]').filter('[value="' + transactionType + '"]').prop('checked', true);
        }
        else if (transactionType == 'RECEIPT') {
            $("#" + context.getId('transactionBtnDiv')).find('input[name="transaction"]').filter('[value="' + transactionType + '"]').prop('checked', true);
        }
        else if (transactionType == 'RETURN') {
            $("#" + context.getId('transactionBtnDiv')).find('input[name="transaction"]').filter('[value="' + transactionType + '"]').prop('checked', true);
        }
        context.saveTransactionPropertiesData(currentComponent);
    }

    formBuilder.prototype.bindAdditionalInfoPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("created_by")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.created_by);
        $("#" + context.getId("created_date")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.created_dt);
        $("#" + context.getId("latest_status")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.latest_status);
        context.updatePreview();
        context.bindInputLabelDivEdit(currentComponent);
    }

    formBuilder.prototype.bindInputLabelDivEdit = function (currentComponent) {
        var context = this;
        if (currentComponent.configProperties.created_by) {
            $("#" + context.getId("created_by_text")).val(currentComponent.configProperties.createdByLabel);
            $("#" + context.getId('created_by_label')).show();
        } else {
            $("#" + context.getId('created_by_label')).hide();
        }
        if (currentComponent.configProperties.created_dt) {
            $("#" + context.getId("created_date_text")).val(currentComponent.configProperties.createdDateLabel);
            $("#" + context.getId('created_date_label')).show();
        } else {
            $("#" + context.getId('created_date_label')).hide();
        }
        if (currentComponent.configProperties.latest_status) {
            $("#" + context.getId("latest_status_text")).val(currentComponent.configProperties.latestStatusLabel);
            $("#" + context.getId('latest_status_label')).show();
        } else {
            $("#" + context.getId('latest_status_label')).hide();
        }
    }

    formBuilder.prototype.bindFormTitlePropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("titleId")).val(currentComponent.configProperties.title);
        context.divFile(context.getId("leftInputTitleId"), currentComponent.configProperties.leftTitle);
        context.divFile(context.getId("rightInputTitleId"), currentComponent.configProperties.rightTitle);
        context.updatePreview();
    }

    formBuilder.prototype.bindNumberPropertiesData = function (currentComponent) {
        var context = this;
        var expression = currentComponent.configProperties?.expression || "";
        var expressionArr = currentComponent.configProperties?.expressionArr || [];
        var usedColumns = currentComponent.configProperties?.usedColumns || [];
        var fieldMap = context.createFieldMapping('selectNumberFields');
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("defaultValueId")).val(currentComponent.defaultValue);
        $("#" + context.getId("regexId")).val(currentComponent.regex);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
        $("#" + context.getId("excludeFromMobId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.excludeFromMob);
        $("#" + context.getId("primaryKeyId")).prop('checked', currentComponent.key === "P");
        $("#" + context.getId("uniqueKeyId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.uniqueKey);
        $("#" + context.getId("hidden")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.hidden);
        $("#" + context.getId("readonly")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.readonly);
        $("#" + context.getId("cost")).prop('checked', currentComponent.configProperties?.cost);
        $("#" + context.getId("length")).prop('checked', currentComponent.configProperties?.length);
        $("#" + context.getId("showInWebId")).prop('checked', currentComponent.configProperties?.showInWeb);
        $("#" + context.getId("showInMobId")).prop('checked', currentComponent.configProperties?.showInMob);
        $("#" + context.getId("copyId")).prop('checked', currentComponent.configProperties?.copy);
        $("#" + context.getId("expressionId")).prop('checked', currentComponent.configProperties?.expressionValidation);
        context.addButtonHandler(currentComponent, 'selectNumberAddBtn', 'NUMBER', expressionArr, usedColumns);
        context.addTextHandler(currentComponent, 'textNumberAddBtn', expressionArr, usedColumns);
        context.bindNumberOperatorClickEvents(currentComponent, expressionArr, usedColumns);
        context.backButtonHandler(currentComponent, 'numberBackBtn', 'NUMBER', expressionArr, usedColumns);

        if (currentComponent.configProperties?.expressionValidation) {
            $("#" + context.getId('formulaBuilderNumberDiv')).show();
            $("#" + context.getId('formulaNumberDisplay')).attr("exp_attr", JSON.stringify(expressionArr));
            $("#" + context.getId('formulaNumberDisplay')).text(expressionArr.map(a => fieldMap[a.trim()] || a.trim()).join(' '));
            $("#" + context.getId("errorInputField")).val(currentComponent.configProperties.errorMessage ? currentComponent.configProperties.errorMessage : "");
            $("#" + context.getId("expressionLabel")).text(expression ? expression.split(',').map(a => fieldMap[a.trim()] || a.trim()).join(' ') : "");
        } else {
            $("#" + context.getId('formulaBuilderNumberDiv')).hide();
        }
        $("#" + context.getId("checklabelId")).focusout(function () {
            context.bindNumberAndDecimalDropdown();
            context.updateFormulaDisplay(currentComponent, 'NUMBER', expressionArr);
        });

        $("#" + context.getId("expressionId")).on('change', function () {
            context.toggleFormulaBuilder($(this).prop('checked'));
        });
    }

    formBuilder.prototype.bindDecimalPropertiesData = function (currentComponent) {
        var context = this;
        var expression = currentComponent.configProperties?.expression || "";
        var expressionArr = currentComponent.configProperties?.expressionArr || [];
        var usedColumns = currentComponent.configProperties?.usedColumns || [];
        var fieldMap = context.createFieldMapping('selectNumberFields');
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("defaultValueId")).val(currentComponent.defaultValue);
        $("#" + context.getId("regexId")).val(currentComponent.regex);
        $("#" + context.getId("decimalPlacesId")).val(currentComponent.configProperties.decimalPlaces);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
        $("#" + context.getId("excludeFromMobId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.excludeFromMob);
        $("#" + context.getId("primaryKeyId")).prop('checked', currentComponent.key === "P");
        $("#" + context.getId("uniqueKeyId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.uniqueKey);
        $("#" + context.getId("hidden")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.hidden);
        $("#" + context.getId("cost")).prop('checked', currentComponent.configProperties?.cost);
        $("#" + context.getId("length")).prop('checked', currentComponent.configProperties?.length);
        $("#" + context.getId("readonly")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.readonly);
        $("#" + context.getId("showInWebId")).prop('checked', currentComponent.configProperties?.showInWeb);
        $("#" + context.getId("showInMobId")).prop('checked', currentComponent.configProperties?.showInMob);
        $("#" + context.getId("copyId")).prop('checked', currentComponent.configProperties?.copy);
        $("#" + context.getId("expressionId")).prop('checked', currentComponent.configProperties?.expressionValidation);
        context.addButtonHandler(currentComponent, 'selectNumberAddBtn', 'NUMBER', expressionArr, usedColumns);
        context.addTextHandler(currentComponent, 'textNumberAddBtn', expressionArr, usedColumns);
        context.bindNumberOperatorClickEvents(currentComponent, expressionArr, usedColumns);
        context.backButtonHandler(currentComponent, 'numberBackBtn', 'NUMBER', expressionArr, usedColumns);

        if (currentComponent.configProperties?.expressionValidation) {
            $("#" + context.getId('formulaBuilderNumberDiv')).show();
            $("#" + context.getId('formulaNumberDisplay')).attr("exp_attr", JSON.stringify(expressionArr));
            $("#" + context.getId('formulaNumberDisplay')).text(expressionArr.map(a => fieldMap[a.trim()] || a.trim()).join(' '));
            $("#" + context.getId("errorInputField")).val(currentComponent.configProperties.errorMessage ? currentComponent.configProperties.errorMessage : "");
            $("#" + context.getId("expressionLabel")).text(expression ? expression.split(',').map(a => fieldMap[a.trim()] || a.trim()).join(' ') : "");
        } else {
            $("#" + context.getId('formulaBuilderNumberDiv')).hide();
        }
        $("#" + context.getId("checklabelId")).focusout(function () {
            context.bindNumberAndDecimalDropdown();
            context.updateFormulaDisplay(currentComponent, 'NUMBER', expressionArr);
        });
        $("#" + context.getId("expressionId")).on('change', function () {
            context.toggleFormulaBuilder($(this).prop('checked'));
        });
    }

    formBuilder.prototype.toggleFormulaBuilder = function (isChecked) {
        var context = this;
        if (isChecked) {
            $("#" + context.getId('formulaBuilderNumberDiv')).show();
        } else {
            $("#" + context.getId('formulaBuilderNumberDiv')).hide();
            $("#" + context.getId('selectNumberFields')).val('');
            $("#" + context.getId('spanNumberDiv')).val('');
            $("#" + context.getId('inputNumberField')).val('');
            $("#" + context.getId('errorInputField')).val('');
            $("#" + context.getId('formulaNumberDisplay')).text('').removeAttr('exp_attr');
        }
    }

    formBuilder.prototype.addStringHandler = function (currentComponent, btnId, dataType, expressionArr, usedColumns) {
        var context = this;
        $("#" + context.getId(btnId)).off('click').on('click', function () {
            var enteredText = $("#" + context.getId("inputStringField"))?.val();
            if (enteredText) {
                expressionArr.push(enteredText);
                usedColumns.push(enteredText);
                currentComponent.configProperties.expression = (currentComponent.configProperties.expression && !currentComponent.configProperties.expression.endsWith(',')) ? currentComponent.configProperties.expression + " ," + enteredText : (currentComponent.configProperties.expression || '') + enteredText;
                currentComponent.configProperties.expressionArr = expressionArr || [];
                currentComponent.configProperties.usedColumns = usedColumns || [];
                $("#" + context.getId('formulaStringDisplay')).attr("exp_attr", JSON.stringify(expressionArr));
                $("#" + context.getId('inputNumberField')).val('');
                context.updateFormulaDisplay(currentComponent, 'STRING', expressionArr);
            }
        });
    }

    formBuilder.prototype.addTextHandler = function (currentComponent, btnId, expressionArr, usedColumns) {
        var context = this;
        $("#" + context.getId(btnId)).off('click').on('click', function () {
            var enteredText = $("#" + context.getId("inputNumberField"))?.val();
            if (enteredText && !isNaN(enteredText)) {
                expressionArr.push(enteredText);
                usedColumns.push(enteredText);
                currentComponent.configProperties.expression = (currentComponent.configProperties.expression && !currentComponent.configProperties.expression.endsWith(',')) ? currentComponent.configProperties.expression + " ," + enteredText : (currentComponent.configProperties.expression || '') + enteredText;
                currentComponent.configProperties.expressionArr = expressionArr || [];
                currentComponent.configProperties.usedColumns = usedColumns || [];
                $("#" + context.getId('formulaNumberDisplay')).attr("exp_attr", JSON.stringify(expressionArr));
                $("#" + context.getId('inputNumberField')).val('');
                context.updateFormulaDisplay(currentComponent, 'NUMBER', expressionArr);
            } else {
                context.msgList.push(_common.getLocalizedValue('LBL_NAN'));
                context.bindMessage('WARNING');
            }
        });
    }

    formBuilder.prototype.bindNumberOperatorClickEvents = function (currentComponent, expressionArr, usedColumns) {
        var context = this;
        $("#" + context.getId('numberBtnClear')).off('click').on('click', function () {
            $("#" + context.getId('formulaNumberDisplay')).empty();
            expressionArr.length = 0;
            usedColumns.length = 0;
            currentComponent.configProperties.expression = '';
            currentComponent.configProperties.expressionArr = expressionArr ? expressionArr : [];
            currentComponent.configProperties.usedColumns = usedColumns ? usedColumns : [];
            $("#" + context.getId("errorInputField")).val('');
            $("#" + context.getId('selectNumberFields')).val('');
            $("#" + context.getId('spanNumberDiv')).val('');
            $("#" + context.getId('inputNumberField')).val('');
            context.updateFormulaDisplay(currentComponent, 'NUMBER', expressionArr)
        });
        $("#" + context.getId('operatorNumberAddBtn')).off('click').on('click', function () {
            var selectedOperator = $("#" + context.getId("spanNumberDiv")).find(":selected").text().trim();
            if (selectedOperator) {
                expressionArr.push(selectedOperator);
                currentComponent.configProperties.expression = (currentComponent.configProperties.expression && !currentComponent.configProperties.expression.endsWith(',')) ? currentComponent.configProperties.expression + " ," + selectedOperator : (currentComponent.configProperties.expression || '') + selectedOperator;
                currentComponent.configProperties.expressionArr = expressionArr || [];
                $("#" + context.getId('formulaNumberDisplay')).attr("exp_attr", JSON.stringify(expressionArr));
                $("#" + context.getId('spanNumberDiv')).val('');
                context.updateFormulaDisplay(currentComponent, "NUMBER", expressionArr);
            }
        });
    }

    formBuilder.prototype.bindSelectDatePropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("currentDateId")).prop('checked', currentComponent.configProperties.currentDate);
        $("#" + context.getId("nonEditDate")).prop('checked', currentComponent.configProperties.nonEditDate);
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
        $("#" + context.getId("excludeFromMobId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.excludeFromMob);
        $("#" + context.getId("showInWebId")).prop('checked', currentComponent.configProperties?.showInWeb);
        $("#" + context.getId("showInMobId")).prop('checked', currentComponent.configProperties?.showInMob);
        $("#" + context.getId("copyId")).prop('checked', currentComponent.configProperties?.copy);
    }

    formBuilder.prototype.bindSelectDateAndTimePropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("currentDateId")).prop('checked', currentComponent.configProperties.currentDate);
        $("#" + context.getId("nonEditDate")).prop('checked', currentComponent.configProperties.nonEditDate);
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
        $("#" + context.getId("excludeFromMobId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.excludeFromMob);
        $("#" + context.getId("showInWebId")).prop('checked', currentComponent.configProperties?.showInWeb);
        $("#" + context.getId("showInMobId")).prop('checked', currentComponent.configProperties?.showInMob);
        $("#" + context.getId("copyId")).prop('checked', currentComponent.configProperties?.copy);
    }

    formBuilder.prototype.bindRelationalDataInputPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("dropdownBox_sidesLabel")).val(currentComponent.configProperties.sidesLabel);
        $("#" + context.getId("dropdownBox_rdiRule")).val(currentComponent.configProperties.rdiRule);
        $("#" + context.getId("dropdownBox_rdiAssignment")).val(currentComponent.configProperties.rdiAssignment);
        $("#" + context.getId("dropdownBox_rdiAssignee")).val(currentComponent.configProperties.rdiAssignee);
        $("#" + context.getId("dropdownBox_rdiRuleAndAssignment")).val(currentComponent.configProperties.rdiRuleAndAssignment);
        $("#" + context.getId("dropdownBox_rdiQualification")).val(currentComponent.configProperties.rdiQualification);
        if (currentComponent.configProperties.rdiRule) {
            context.bindSidesLabelList();
            context.bindRdiDropdownSides(currentComponent.configProperties.rdiRule);
            $("#" + context.getId("dropdownBox_rdiNoOfSides")).val(currentComponent.configProperties.noOfSidesAttr);
        }
        if (currentComponent.configProperties.rdiAssignment) {
            context.bindNoOfAssigneeFormList(currentComponent.configProperties.rdiAssignment, currentComponent.configProperties.rdiRule);
            context.bindRdiDropdownNoOfAssignee(currentComponent.configProperties.rdiAssignment, currentComponent.configProperties.rdiRule);
            var noOfAssigneeValue = currentComponent.configProperties.rdiNoOfAssignee + "_" + currentComponent.configProperties.noOfAssigneeAttr;
            $("#" + context.getId("dropdownBox_rdiNoOfAssignee")).val(noOfAssigneeValue);
        }
    }

    formBuilder.prototype.bindDropDownPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("multiselectId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.multiSelect);
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
        $("#" + context.getId("excludeFromMobId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.excludeFromMob);
        $("#" + context.getId("uniqueKeyId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.uniqueKey);
        $("#" + context.getId("showInWebId")).prop('checked', currentComponent.configProperties?.showInWeb);
        $("#" + context.getId("showInMobId")).prop('checked', currentComponent.configProperties?.showInMob);
        $("#" + context.getId("copyId")).prop('checked', currentComponent.configProperties?.copy);
        $("#" + context.getId("scannerCheckBox")).prop('checked', currentComponent.configProperties.scanner);
        $("#" + context.getId("uniqueKeyId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.uniqueKey);
        var dataSourceType = currentComponent.configProperties?.dataSourceType;
        if (dataSourceType == 'LOV') {
            $("#" + context.getId('radioBtnDiv')).find('input[name="lovDataSource"]').filter('[value="' + dataSourceType + '"]').prop('checked', true);
            $("#" + context.getId("lovDiv")).show();
            $("#" + context.getId("ddlDropdownBox")).val(currentComponent.configProperties?.lovId);
            $("#" + context.getId("primaryKeyPartitionLi")).addClass('lib-hide');
            $("#" + context.getId("primaryKeyPartition")).prop('checked', false);
            $("#" + context.getId("additionalConditionColumnLi")).hide();
            $("#" + context.getId("rangeColumnLi")).hide();
        }
        else if (dataSourceType == 'SERVICE') {
            $("#" + context.getId('radioBtnDiv')).find('input[name="lovDataSource"]').filter('[value="' + dataSourceType + '"]').prop('checked', true);
            $("#" + context.getId("serviceDiv")).show();
            $("#" + context.getId("selectApi")).val(currentComponent.configProperties?.selectedApi);
        }
        else if (dataSourceType == 'FORM') {
            $("#" + context.getId('radioBtnDiv')).find('input[name="lovDataSource"]').filter('[value="' + dataSourceType + '"]').prop('checked', true);
            $("#" + context.getId("formDropdownDiv")).show();
            $("#" + context.getId("enableRangeFilterLi")).show();
            $("#" + context.getId("primaryKeyPartitionLi")).removeClass('lib-hide');
            $("#" + context.getId("additionalConditionColumnLi")).show(); // Data existing rules div shows
            if (currentComponent.configProperties?.type === 'TEMPLATE') {
                $("#" + context.getId("formDropdown")).val(currentComponent.configProperties?.formId); // Brand Details Populate
            } else {
                $("#" + context.getId("formDropdown")).val(currentComponent.configProperties?.featureId);
                if (currentComponent.configProperties?.featureId == 'MATERIAL') {
                    $("#" + context.getId("multiSelectLi")).hide();
                }
            }
            $("#" + context.getId("formAttributesList")).val(currentComponent.configProperties?.formAttribute);
            $("#" + context.getId("existingDataFormDropdown")).attr("data-tablename", currentComponent.configProperties.existingDataTable);
            $("#" + context.getId("existingDataFormDropdown")).val(currentComponent.configProperties?.existingDataTemplate);
            $("#" + context.getId("dataExistAttributeList")).val(currentComponent.configProperties?.existingDataAttrId);
            $("#" + context.getId("enableRangeFilter")).prop('checked', currentComponent.configProperties?.enableRangeFilter);

            if (currentComponent.configProperties?.enableRangeFilter) {
                $("#" + context.getId("rangeColumnLi")).show();
                context.selectedFormAndBindRangeCon(currentComponent);
            }
            context.bindFilteredAttributesForForm(currentComponent.configProperties?.formId, currentComponent.configProperties?.formAttribute);
            if (currentComponent.configProperties?.existingDataAttrId) {
                context.bindFilteredAttributesForDataExistence(currentComponent.configProperties?.existingDataTemplate, currentComponent.configProperties?.existingDataAttrId);
            }
            $("#" + context.getId("primaryKeyPartition")).prop('checked', currentComponent.configProperties.primaryKeyPartition);
            context.bindEditAdditionalCondition(currentComponent);
            context.bindEditFormCondition(currentComponent);
        }
    }

    formBuilder.prototype.onChangeDropdownProperties = function (currentComponent) {
        var context = this;
        for (var i = 0; i < context.definitionList.length; i++) {
            var def = context.definitionList[i];
            if (def.subType === 'autoPopulated' && currentComponent.id === def.configProperties.attributeId) {
                var autoPopulatedDef = context.definitionList.find(d => d.id === def.id);
                var isMaterialForm = context.definitionList.find(definition => definition.id === autoPopulatedDef.configProperties?.dependentOn && definition.configProperties?.featureId === 'MATERIAL');

                var isUsed;
                if (isMaterialForm) {
                    var materialTemplates = context.templateList?.filter(template => template.table_name === "MATERIAL");
                    var table_name = autoPopulatedDef?.configProperties?.tableName;
                    isUsed = context.definitionList.some(def => def.subType === "calculatedfields" && def.configProperties?.usedColumns?.some(column => materialTemplates?.some(template => column.includes(template.id))));
                } else {
                    var selectedTemplate = context.templateList?.find(template => template.template_id === currentComponent.configProperties?.formId);
                    isUsed = context.definitionList.some(def => def.subType === "calculatedfields" && def.configProperties?.usedColumns?.some(column => selectedTemplate?.definitions.some(innerDef => column.includes(innerDef.id))));
                }
                if (isUsed) {
                    var dependsOnDefinition = autoPopulatedDef ? context.definitionList.find(def => def.id === autoPopulatedDef.configProperties?.attributeId) : null;
                    context.msgList.push(_common.getLocalizedValue("LBL_ATTRIBUTE_IS_USED_IN_THE_EXPRESSION").format([dependsOnDefinition?.label]));
                    context.bindMessage('WARNING');
                    if (dependsOnDefinition) {
                        $("#" + context.getId("formDropdown")).val(dependsOnDefinition.configProperties?.formId || dependsOnDefinition.configProperties?.featureId);
                    }
                    return true;
                } else {
                    var table_name = autoPopulatedDef?.configProperties?.tableName;
                    table_name ? context.bindFieldFormAttributeDropdown('', table_name) : $("#" + context.getId('fieldAttributeList')).empty();
                    return false;
                }
            }
        }
    }

    formBuilder.prototype.bindEditRangeCondition = function (currentComponent) {
        var context = this;

        $("#" + context.getId("rangeColumns")).empty();
        if (currentComponent?.configProperties.rangeConditionList) {
            $("#" + context.getId("rangeColumns")).empty();
            $(currentComponent?.configProperties.rangeConditionList).each(function (key, value) {
                var autoId = context.getUUID();
                context.createRangeConditionRows(currentComponent?.id, autoId, value);
            })
        }
    }

    formBuilder.prototype.bindEditAdditionalCondition = function (currentComponent) {
        var context = this;
        if (currentComponent?.configProperties.dataExistenceConditions) {
            $("#" + context.getId("additionalConditionColumns")).empty();
            $(currentComponent?.configProperties?.dataExistenceConditions).each(function (key, value) {
                var autoId = context.getUUID();
                context.createAdditionalConditionRows(currentComponent?.id, autoId, value);
//                $("#" + context.getId(autoId + "dataExistAttributeList")).empty();
            })
        }
    }

    formBuilder.prototype.bindEditFormCondition = function (currentComponent) {
        var context = this;
        if (currentComponent?.configProperties.formConditions) {
            $("#" + context.getId("formConditionColumns")).empty();
            $(currentComponent?.configProperties?.formConditions).each(function (key, value) {
                var autoId = context.getUUID();
                context.createFormConditionRows(currentComponent
        }?.id, autoId, value);
            })
    }

    formBuilder.prototype.bindFileUploadPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("imageOnlyId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.imageOnly);
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
    }

    formBuilder.prototype.bindActionPropertiesData = function (currentComponent) {
        var context = this;
        var actionProperties = currentComponent?.actionProperties || {};
        actionProperties.dataStatus = !actionProperties.dataStatus ? [] : actionProperties.dataStatus;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("otherEmailId")).val(currentComponent.actionProperties.otherEmail);
        $("#" + context.getId("ddlInitialState")).val(actionProperties.dataStatus.length == 0 ? actionProperties.dataStatus.push("") : actionProperties.dataStatus);
        $("#" + context.getId("ddlNextState")).val(actionProperties.actionStatus);
        $("#" + context.getId("templateList")).val(actionProperties.template_id);
        $("#" + context.getId("ddlBusinessEvent")).val(actionProperties.businessEvent);
        $("#" + context.getId("assign")).prop('checked', actionProperties.assignTo);
        $("#" + context.getId("confirmation")).prop('checked', actionProperties.confirm);
        $("#" + context.getId("comment")).prop('checked', actionProperties.comment);
        $("#" + context.getId("conditionAcceptedPermission")).prop('checked', actionProperties.conditionAcceptedPermission);
        $("#" + context.getId("navigation")).prop("checked", actionProperties.onlyForNavigation);
        $("#" + context.getId("conditionnotificationPermission")).prop("checked", actionProperties.notificationPermission);
        $("#" + context.getId("pushnotificationPermission")).prop("checked", actionProperties.pushnotificationPermission);
        $("#" + context.getId("redirectForm")).val(actionProperties.redirectForm);
        $("#" + context.getId("emailtemplateForm")).val(actionProperties.emailtemplateForm);

        context.selectedUserGroup = Array.isArray(actionProperties.userGroupList) ? actionProperties.userGroupList : [];
        context.selectEmailGroup = Array.isArray(actionProperties.emailGroupList) ? actionProperties.emailGroupList : [];
        context.selectedDataStatus = Array.isArray(actionProperties.dataStatus) ? actionProperties.dataStatus : [];
        context.selectedStages = Array.isArray(actionProperties.stages) ? actionProperties.stages : [];
        context.selectedFieldLevelPermission = Array.isArray(actionProperties.fieldLevelPermission) ? actionProperties.fieldLevelPermission : context.getDefaultFieldLevelPermission();
        context.bindUserGroups();
        context.bindEmailGroups();
        context.bindDataStatus();
        context.bindStages();
        context.bindFieldLevelPermission();
    }

    formBuilder.prototype.bindActionFormPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("templateList")).val(currentComponent.configProperties.template_id);
        context.selectedUserGroupForm = Array.isArray(currentComponent.configProperties.userGroupList) ? currentComponent.configProperties.userGroupList : [];
        context.bindFormUserGroups();
    }

    formBuilder.prototype.getDefaultFieldLevelPermission = function () {
        var fieldLevelPermission = [];
        var context = this;
        for (var i = 0; i < context.definitionList.length; i++) {
            var def = context.definitionList[i];
            if (def.subType != 'action' && def.subType != 'heading') {
                fieldLevelPermission.push(def.id);
            }
        }
        return fieldLevelPermission;

    }


    formBuilder.prototype.bindRadioPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
        $("#" + context.getId("excludeFromMobId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.excludeFromMob);
        $("#" + context.getId("ddlSelectLov")).val(currentComponent.configProperties.lovId);
        $("#" + context.getId("showInWebId")).prop('checked', currentComponent.configProperties?.showInWeb);
        $("#" + context.getId("showInMobId")).prop('checked', currentComponent.configProperties?.showInMob);
        $("#" + context.getId("copyId")).prop('checked', currentComponent.configProperties?.copy);
    }

    formBuilder.prototype.bindCheckboxPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("shorttextId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.shortText);
        $("#" + context.getId("excludeFromMobId")).prop('checked', currentComponent.configProperties && currentComponent.configProperties.excludeFromMob);
        $("#" + context.getId("ddlSelectLovCheckbox")).val(currentComponent.configProperties.lovId);
        $("#" + context.getId("showInWebId")).prop('checked', currentComponent.configProperties?.showInWeb);
        $("#" + context.getId("showInMobId")).prop('checked', currentComponent.configProperties?.showInMob);
        $("#" + context.getId("copyId")).prop('checked', currentComponent.configProperties?.copy);
    }

    formBuilder.prototype.bindCheckpointPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("customId")).val(currentComponent.customId);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
        $("#" + context.getId("ddlSelectLovCheckpoint")).val(currentComponent?.configProperties?.lovId);
    }

    formBuilder.prototype.bindFormPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("allowMultiple")).prop('checked', currentComponent.configProperties.allowMultipleEntries);
        $("#" + context.getId("templateList")).val(currentComponent.configProperties.template_id);
        $("#" + context.getId("externalId")).prop('checked', currentComponent.configProperties.isReferenceForm);
        $("#" + context.getId("popupLableId")).val(currentComponent.configProperties.popupLable);
        $("#" + context.getId("buttonId")).val(currentComponent.configProperties.buttonName);
        $("#" + context.getId("checkBoxId")).prop('checked', currentComponent.constraint === "M");
    }

    formBuilder.prototype.bindFieldPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("checklabelId")).val(currentComponent.label);
        $("#" + context.getId("autoPopulatedDef")).val(currentComponent.configProperties?.attributeId).attr('data-templateId', currentComponent.configProperties?.template_id).attr('tableName', currentComponent.configProperties?.tableName);
        context.selectedAttributesList = Array.isArray(currentComponent.configProperties?.selectedAttributesList) ? currentComponent.configProperties?.selectedAttributesList : [];
        var template_id = context.definitionList.find(definition => definition.id === currentComponent.configProperties?.attributeId)?.configProperties?.formId;
        var table_name = context.definitionList.find(definition => definition.id === currentComponent.configProperties?.attributeId)?.configProperties?.featureId
        template_id || table_name ? context.bindFieldFormAttributeDropdown(template_id, table_name) : $("#" + context.getId('fieldAttributeList')).empty();
    }

    formBuilder.prototype.bindGridPropertiesData = function (currentComponent) {
        var context = this;
        $("#" + context.getId("popupLableId")).val(currentComponent.configProperties.popupLable);
        $("#" + context.getId("buttonId")).val(currentComponent.configProperties.buttonName);
        $("#" + context.getId("eventLabel")).val(currentComponent.configProperties.eventLabel);
        $("#" + context.getId("eventMessage")).val(currentComponent.configProperties.eventMessage);
        $("#" + context.getId("eventId")).val(currentComponent.configProperties.eventId);
        $("#" + context.getId("gridTemplateList")).val(currentComponent.configProperties.template_id);
        $("#" + context.getId("gridRedirectForm")).val(currentComponent.configProperties.redirectForm);
        $("#" + context.getId("parentGridTemplateList")).val(currentComponent.configProperties.parentTemplateId);
        $("#" + context.getId("showInPopup")).prop("checked", currentComponent.configProperties.showInPopup);
        $("#" + context.getId("enableEditMode")).prop('checked', currentComponent.configProperties.enableEditMode);
        $("#" + context.getId("assignCheckBox")).prop('checked', currentComponent.configProperties.assignCheckBox);
        $("#" + context.getId("scannerCheckBox")).prop('checked', currentComponent.configProperties.scanner);
        context.selectedGridAttributeList = Array.isArray(currentComponent.configProperties?.selectedGridAttributeList) ? currentComponent.configProperties?.selectedGridAttributeList : [];
        context.bindGridFormAttributeDropdown(currentComponent.configProperties.template_id);
    }

    formBuilder.prototype.onDelete = function (deleteId) {
        var context = this;
        context.expressionInUseCheck(deleteId);
        if (context.msgList.length > 0) {
            context.bindMessage('WARNING');
            return;
        }
        context.removeById(deleteId);
        context.bindAttributes();
        $("#" + context.getId("spatialRuleBtn")).css("display", "none");
        $("#" + context.getId("ulProperties")).empty();
        console.log(context.definitionList);
        if ($("#" + context.getId("ulDefinition")).children().length == 0) {
            $("#" + context.getId("ulProperties")).empty();
        }
        $("#" + context.getId('ulDefinition')).find(".repeat-row:first").click();
        if (context.definitionList.length == 0) {
            $("#" + context.getId("ulDefinition")).empty();
        }
    }

    formBuilder.prototype.expressionInUseCheck = function (deleteId) {
        var context = this;
        for (let i = 0; i < context.definitionList.length; i++) {
            let def = context.definitionList[i];
            if (def.subType === 'number' || def.subType === 'decimal' || def.subType === 'calculatedfields') {
                var expressionArr = def.configProperties?.expressionArr || [];
                if (expressionArr.includes(deleteId)) {
                    context.msgList.push(_common.getLocalizedValue('LBL_WIDGET_IN_EXPRESSION'));
                    break;
                }
            }
            if (def.subType === 'calculatedfields' && def.configProperties?.dataSourceType === "DISTANCE" && (def.configProperties?.fromAttribute === deleteId || def.configProperties?.toAttribute === deleteId)) {
                context.msgList.push(_common.getLocalizedValue('LBL_WIDGET_IN_CALCULATED_FIELD'));
                break;
            }
        }
    };

    formBuilder.prototype.bindLabelClick = function () {
        var context = this;
        $("#" + context.getId("properties_container")).unbind("change").bind("change", function () {
            context.savePropertyData(), context.changeLabel();
        });
        $("#" + context.getId("ulDefinition")).off('click').on('click', '.delete-cross', function () {
            var deleteId = $(this).attr("data-id");
            context.onDelete(deleteId);
        });
    }

    formBuilder.prototype.changeLabel = function () {
        var context = this;
        for (var i = 0; i < context.definitionList.length; i++) {
            var metaData = context.definitionList[i];
            var currentComponent = context.getComponent(metaData.id);
            var label = currentComponent.label;
            if (metaData.type == "action" || metaData.type == "actionForm") {
                $("#" + context.getId(metaData.id)).find('button').html(label);
            } else {
                $("#" + context.getId(metaData.id)).find('label').html(label);
            }
        }
    }
    formBuilder.prototype.bindProperties = function (id) {
        var context = this;
        var currentId = context.getComponent(id);
        if (currentId.subType == "text") {
            context.bindTextProperties();
        }
        else if (currentId.subType == "textArea") {
            context.bindTextAreaProperties();
        }
        else if (currentId.subType == "divider") {
            context.bindDividerProperties();
        }
        else if (currentId.subType == "decimal") {
            context.bindDecimalProperties();
        }
        else if (currentId.subType == "heading") {
            context.bindHeadingProperties();
        }
        else if (currentId.subType == "evaluationresult") {
            context.bindEvaluationResultProperties();
        }
        else if (currentId.subType == "autonumber") {
            context.bindAutoNumberProperties();
        }
        else if (currentId.subType == "calculatedfields") {
            context.bindCalculatedFieldProperties();
        }
        else if (currentId.subType == "transaction") {
            context.bindTransactionProperties();
        }
        else if (currentId.subType == "rdi") {
            context.bindRelationalDataInputProperties();
        }
        else if (currentId.subType == "additionalinfo") {
            context.bindAdditionalInfoProperties();
        }
        else if (currentId.subType == "formTitle") {
            context.bindFormTitleProperties();
        }
        else if (currentId.subType == "number") {
            context.bindNumberProperties();
        }
        else if (currentId.subType == "date") {
            context.bindSelectDateProperties();
        }
        else if (currentId.subType == "select") {
            context.bindDropDownProperties(id);
        }
        else if (currentId.subType == "file") {
            context.bindFileUploadProperties();
        }
        else if (currentId.subType == "action") {
            context.bindActionProperties();
        }
        else if (currentId.subType == "radio") {
            context.bindRadioProperties();
        }
        else if (currentId.subType == "checkbox") {
            context.bindCheckboxProperties();
        }
        else if (currentId.subType == "comment") {
            context.bindCommentProperties();
        }
        else if (currentId.subType == "mm") {
            context.bindMMNumberProperties();
        }
        else if (currentId.subType == "checkpoint") {
            context.bindCheckpointProperties();
        }
        else if (currentId.subType == "form") {
            context.bindFormProperties();
        }
        else if (currentId.subType == "autoPopulated") {
            context.bindFieldProperties();
        }
        else if (currentId.subType == "grid") {
            context.bindGridProperties();
        }
        else if (currentId.subType == "scanner") {
            context.bindScannerProperties();
        }
        else if (currentId.subType == "scancode") {
            context.bindScanCodeProperties();
        }
        else if (currentId.subType == "coordinate") {
            context.bindCoordinateProperties();
        }
        else if (currentId.subType == "template") {
            context.bindTemplateProperties();
        }

        else if (currentId.subType == "table") {
            context.bindTableProperties(currentId);
        }
        else if (currentId.subType == "dateTime") {
            context.bindSelectDateAndTimeProperties();
        }
        else if (currentId.subType == "actionForm") {
            context.bindActionFormProperties();
        }
        else if (currentId.subType == "contextLabel") {
            context.bindContextLabelProperties();
        }
        else if (currentId.subType == "matrix") {
            context.bindMatrixProperties();
        }
        else if (currentId.subType == "location") {
            context.bindLocationProperties();
        }
        else if (currentId.subType == "signatory") {
            context.bindSignatoryProperties();
        }
        else if (currentId.subType == "user") {
            context.bindUserProperties();
        }
        else if (currentId.subType == "evaluation") {
            context.bindEvaluationProperties();
        }
    }

    formBuilder.prototype.bindTextProperties = function () {
        var context = this;

        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $defaultValueLi = context.bindPropertyDefaultValue();
        var $regexLi = context.bindPropertyRegex();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $shortTextLi = context.bindPropertysortText();
        var $excludeFromMobile = context.bindPropertyExcludeFromMobile();
        var $hiddenLi = context.bindPropertyHidden();
        var $primaryKeyLi = context.bindPropertyPrimary();
        var $readonlyLi = context.bindPropertyReadonly();
        var $uniqueKeyLi = context.bindPropertyUnique();
        var $showInWebLi = context.bindToggleProperty('showInWebId', 'LBL_SHOW_IN_WEB');
        var $showInMobLi = context.bindToggleProperty('showInMobId', 'LBL_SHOW_IN_MOB');
        var $copyLi = context.bindToggleProperty('copyId', 'LBL_COPY');

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $defaultValueLi, $regexLi, $mandatoryLi, $shortTextLi, $excludeFromMobile, $hiddenLi, $primaryKeyLi, $readonlyLi, $uniqueKeyLi, $showInWebLi, $showInMobLi, $copyLi);

        context.primaryKeyTrigger();
        context.hiddenTrigger();
    }

    formBuilder.prototype.bindContextLabelProperties = function () {
        var context = this;

        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $shortTextLi = context.bindPropertysortText();
        var $excludeFromMobile = context.bindPropertyExcludeFromMobile();
        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $shortTextLi, $excludeFromMobile);
    }

    formBuilder.prototype.bindScannerProperties = function () {
        var context = this;

        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $shortTextLi = context.bindPropertysortText();
        var $autoGeneratedQrLi = context.bindPropertyAutoGeneratedQr();

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $shortTextLi, $mandatoryLi, $autoGeneratedQrLi);
    }

    formBuilder.prototype.bindScanCodeProperties = function () {
        var context = this;

        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        $("#" + context.getId("ulProperties")).append($idLi);
        context.bindQuerySet("ddlScanCodeDataSet");
    }

    formBuilder.prototype.bindCoordinateProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();
        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $shortTextLi = context.bindPropertysortText();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $radioBtnLi = context.createCoordinateRadioContainer();
        var $spatialLi = context.bindSpatialProperties();
        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $shortTextLi, $mandatoryLi, $radioBtnLi, $spatialLi);
        $("#" + context.getId('radioBtnDiv')).find('input[name="coordinate"]').on('change', function () {
            context.updateSpatialFieldsBasedOnCoordinateType();
        });
        $("#" + context.getId("spatialStyleInput")).off('change').on('change', function () {
            context.resetStyle();
            context.updateColorForCrossSpatialStyle();
        });
        $("#" + context.getId("spatialColorInput")).off("change").on("change", function () {
            context.resetColorCode();
        });
    }

    formBuilder.prototype.bindTemplateProperties = function () {
        var context = this;

        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $shortTextLi = context.bindPropertysortText();
        var $excludeFromMobile = context.bindPropertyExcludeFromMobile();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $moduleLi = context.bindTemplateModule();
        var $showInWebLi = context.bindToggleProperty('showInTemplateWebId', 'LBL_SHOW_IN_WEB');

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $mandatoryLi, $shortTextLi, $excludeFromMobile, $showInWebLi, $moduleLi);
    }


    formBuilder.prototype.bindTableProperties = function (definition) {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();
        var id = context.getUUID();
        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $labelColumn = context.bindTableColumn();
        var $labelRow = context.bindTableRow();
        $('#' + context.getId('ulProperties')).append($idLi, $labelLi, $mandatoryLi, $labelColumn, $labelRow);
        if (!definition.configProperties.columns) {
            context.createColumnsAndRemove(id);
        }
        $('#' + context.getId('addColumnBtn')).unbind('click').bind('click', function () {
            context.createColumnsAndRemove(context.getUUID());
            $(".column-delete-cross").unbind("click").bind('click', function () {
                if ($('#' + context.getId('tbl_col_div')).find('.column-delete-cross').length > 1) {
                    $('#' + $(this).attr('data-id')).remove();
                    context.saveTablePropertyData();
                }
            });
        })
        if (!definition.configProperties.rows) {
            context.createRowAndRemove(id);
        }
        $('#' + context.getId('addRowBtn')).unbind('click').bind('click', function () {
            context.createRowAndRemove(context.getUUID());
            $('.row-delete-cross').unbind('click').bind('click', function () {
                if ($('#' + context.getId('tbl_row_div')).find('.row-delete-cross').length > 1) {
                    $('#' + $(this).attr('data-id')).remove();
                    context.saveTablePropertyData();
                }
            });
        });
    }

    formBuilder.prototype.bindMMNumberProperties = function () {
        var context = this;

        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $shortTextLi = context.bindPropertysortText();
        var $excludeFromMobile = context.bindPropertyExcludeFromMobile();
        var $primaryKeyLi = context.bindPropertyPrimary();

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $mandatoryLi, $shortTextLi, $excludeFromMobile, $primaryKeyLi);
        $("#" + context.getId("checkBoxId")).prop('disabled', true);
        context.primaryKeyTrigger(true);

    }

    formBuilder.prototype.bindTableRow = function () {
        var context = this;
        var $rowLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p '
        });

        var $divRow = $('<div>', {
            id: context.getId('tbl_row_div')
        });

        var $rowLabel = $('<label>', {
            class: 'lib-form-label',
            "data-tkey": '' + context.getUUID() + ''
        }).text(_common.getLocalizedValue('LBL_ROW_TITLES'));

        var $button = $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-right-top',
            type: "button",
            id: context.getId('addRowBtn'),
            title: _common.getLocalizedValue('LBL_ROW_COLUMN')
        }).append($('<i>', {
            class: "fa fa-plus",
        }));

        var $small = $('<small>', {
            class: 'lib-form-label lib-text-normal'

        }).append($('<em>', {
        })).text(_common.getLocalizedValue('LBL_USE_#_FOR_SEPARATING_MULTIPLE_VALUES'))

        $rowLi.append($rowLabel, $small, $button);

        $divRow.sortable({
            update: function (event, ui) {
                context.saveTablePropertyData();
            }
        });

        return ([$rowLi, $divRow]);
    }

    formBuilder.prototype.bindTableColumn = function () {
        var context = this;

        var $columnLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $divCol = $('<div>', {
            id: context.getId('tbl_col_div')
        });

        var $columnLabel = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            "data-tkey": '' + context.getUUID() + ''
        }).text(_common.getLocalizedValue('LBL_COLUMN_TITLES'));
        $columnLabel.appendTo($columnLi);

        var $button = $('<button>', {
            class: "lib-input-btn-custom add-btn-circle-right-top",
            type: "button",
            id: context.getId('addColumnBtn'),
            title: _common.getLocalizedValue('LBL_ADD_COLUMN')
        }).append($('<i>', {
            class: "fa fa-plus",
        }));
        $button.appendTo($columnLi);

        $divCol.sortable({
            start: function (event, ui) {
                context.previousOrder = $divCol.sortable('toArray');
            },
            update: function (event, ui) {
                const isValid = context.validateSorting();
            }
        });

        return [$columnLi, $divCol];
    };

    formBuilder.prototype.validateSorting = function () {
        var context = this;
        context.modal(1);
        $("#" + context.getId('modalTitle')).html(_common.getLocalizedValue('LBL_CONFIRMATION'));
        $("#" + context.getId('modalBox')).addClass("lib-modal-sm");
        $("#" + context.getId('modalcontent')).html(_common.getLocalizedValue('LBL_TABLE_COL_CHANGE_WARNING'));
        $("#" + context.getId('modalFooter')).empty().append($('<button>').addClass('lib-btn-custom lib-rounded-4').attr('id', context.getId('saveBtnCol')).text(_common.getLocalizedValue('LBL_YES')));
        $("#" + context.getId('modalFooter')).append($('<button>').addClass('lib-btn-custom lib-rounded-4').attr('id', context.getId('cancelBtnCol')).text(_common.getLocalizedValue('LBL_NO')));
        $("#" + context.getId("saveBtnCol")).off("click").on("click", function () {
            context.modal(0);
            context.saveTablePropertyData();
        });
        $("#" + context.getId("cancelBtnCol")).off("click").on("click", function () {
            context.modal(0);
            $("#" + context.getId('tbl_col_div')).sortable('cancel');
        });
        return false;
    };


    formBuilder.prototype.bindPropertyDefaultValue = function () {
        var context = this;
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label ',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_DEFAULT_VALUE'));

        var $defaultValueInput = $('<input>', {
            type: 'text',
            id: context.getId('defaultValueId'),
            class: 'lib-form-control',
            autoComplete: 'off',
        });

        return $labelLi.append($label, $defaultValueInput);
    }

    formBuilder.prototype.bindPropertyPrefix = function () {
        var context = this;
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label ',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_PREFIX'));

        var $defaultValueInput = $('<input>', {
            type: 'text',
            id: context.getId('prefixId'),
            class: 'lib-form-control',
            autoComplete: 'off',
        });

        return $labelLi.append($label, $defaultValueInput);
    }
    formBuilder.prototype.bindPropertyRegex = function () {
        var context = this;
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label ',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_REGEX'));

        var $regexInput = $('<input>', {
            type: 'text',
            id: context.getId('regexId'),
            class: 'lib-form-control',
            autoComplete: 'off',
        });

        return $labelLi.append($label, $regexInput);
    }

    formBuilder.prototype.bindPropertyPopupLable = function () {
        var context = this;
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label ',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_POPUP_LABEL'));

        var $popupLabelInput = $('<input>', {
            type: 'text',
            id: context.getId('popupLableId'),
            class: 'lib-form-control',
            autoComplete: 'off',
        });

        return $labelLi.append($label, $popupLabelInput);
    }

    formBuilder.prototype.bindPropertyButton = function () {
        var context = this;
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label ',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_BUTTON_NAME'));

        var $buttonInput = $('<input>', {
            type: 'text',
            id: context.getId('buttonId'),
            class: 'lib-form-control',
            autoComplete: 'off',
        });

        return $labelLi.append($label, $buttonInput);
    }

    formBuilder.prototype.bindEventLabelLi = function () {
        var context = this;
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label ',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_EVENT_LABEL'));

        var $buttonInput = $('<input>', {
            type: 'text',
            id: context.getId('eventLabel'),
            class: 'lib-form-control',
            autoComplete: 'off',
        });

        return $labelLi.append($label, $buttonInput);
    }

    formBuilder.prototype.bindEventMessageLi = function () {
        var context = this;
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label ',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_EVENT_MESSAGE'));

        var $buttonInput = $('<input>', {
            type: 'text',
            id: context.getId('eventMessage'),
            class: 'lib-form-control',
            autoComplete: 'off',
        });

        return $labelLi.append($label, $buttonInput);
    }

    formBuilder.prototype.bindEventIdLi = function () {
        var context = this;
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label ',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_EVENT_ID'));

        var $buttonInput = $('<input>', {
            type: 'text',
            id: context.getId('eventId'),
            class: 'lib-form-control',
            autoComplete: 'off',
        });

        return $labelLi.append($label, $buttonInput);
    }

    formBuilder.prototype.bindTextBoxMandatory = function (id, label) {
        var context = this;
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_LABEL'));

        var $inputBox = $('<input>', {
            type: 'text',
            id: context.getId(id),
            class: 'lib-form-control',
            autoComplete: 'off',
        });

        return $labelLi.append($label, $inputBox);
    }
    formBuilder.prototype.bindTemplateModule = function () {
        var context = this;
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_MODULE'));

        var $inputBox = $('<input>', {
            type: 'text',
            id: context.getId("templateModule"),
            class: 'lib-form-control',
            autoComplete: 'off',
        });

        return $labelLi.append($label, $inputBox);
    }
    formBuilder.prototype.bindDataSet = function () {
        var context = this;
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_DISPLAY_COLUMN'));

        var $inputBox = $('<input>', {
            type: 'text',
            id: context.getId("lookupDisplayCol"),
            class: 'lib-form-control',
            autoComplete: 'off',
        });

        return $labelLi.append($label, $inputBox);
    }

    formBuilder.prototype.bindCheckpointProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $lovCheckpoint = context.bindLovDropDownInCheckpoint();

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $lovCheckpoint, $mandatoryLi);
        context.bindLovDropDownForCheckpoint();
        context.addLovFromCheckpoint();
    }

    formBuilder.prototype.bindFormProperties = function () {
        var context = this;

        $("#" + context.getId("ulProperties")).empty();

        var $labelLi = context.bindPropertyLabel();
        var $templateLi = context.bindPropertyTemplateLi();
        var $multipleEntriesLi = context.bindFormPropertiesAllowMultipleEntries();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $popupLableLi = context.bindPropertyPopupLable();
        var $buttonLi = context.bindPropertyButton();

        $("#" + context.getId("ulProperties")).append($labelLi, $templateLi, $popupLableLi, $buttonLi, $mandatoryLi, $multipleEntriesLi);
        context.bindTemplateListInAction();
        context.addTemplate();
    }


    formBuilder.prototype.bindRadioProperties = function () {
        var context = this;

        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $shortTextLi = context.bindPropertysortText();
        var $excludeFromMobile = context.bindPropertyExcludeFromMobile();
        var $lovList = context.bindLovDropDownInRadio();
        var $showInWebLi = context.bindToggleProperty('showInWebId', 'LBL_SHOW_IN_WEB');
        var $showInMobLi = context.bindToggleProperty('showInMobId', 'LBL_SHOW_IN_MOB');
        var $copyLi = context.bindToggleProperty('copyId', 'LBL_COPY');

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $lovList, $mandatoryLi, $shortTextLi, $excludeFromMobile, $showInWebLi, $showInMobLi, $copyLi);
        context.bindLovDropDownForRadio();
        context.addLovFormRadio();
    }

    formBuilder.prototype.bindCheckboxProperties = function () {
        var context = this;

        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $shortTextLi = context.bindPropertysortText();
        var $excludeFromMobile = context.bindPropertyExcludeFromMobile();
        var $lovList = context.bindLovDropDownInCheckBox();
        var $showInWebLi = context.bindToggleProperty('showInWebId', 'LBL_SHOW_IN_WEB');
        var $showInMobLi = context.bindToggleProperty('showInMobId', 'LBL_SHOW_IN_MOB');
        var $copyLi = context.bindToggleProperty('copyId', 'LBL_COPY');

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $lovList, $mandatoryLi, $shortTextLi, $excludeFromMobile, $showInWebLi, $showInMobLi, $copyLi);
        context.addLovFromCheckbox();
        context.bindLovDropDownForCheckbox();
    }

    formBuilder.prototype.bindTextAreaProperties = function () {
        var context = this;

        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $regexLi = context.bindPropertyRegex();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $shortTextLi = context.bindPropertysortText();
        var $excludeFromMobile = context.bindPropertyExcludeFromMobile();
        var $showInWebLi = context.bindToggleProperty('showInWebId', 'LBL_SHOW_IN_WEB');
        var $showInMobLi = context.bindToggleProperty('showInMobId', 'LBL_SHOW_IN_MOB');
        var $copyLi = context.bindToggleProperty('copyId', 'LBL_COPY');

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $regexLi, $mandatoryLi, $shortTextLi, $excludeFromMobile, $showInWebLi, $showInMobLi, $copyLi);
    }

    formBuilder.prototype.bindMatrixProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();
        var $formLi = context.bindPropertiesFormLi();
        var $formColumnLi = context.bindPropertiesDisplayColumnLi();
        var $formAndConditionLi = context.bindMatrixCondition();
        var $templateFormLi = context.bindPropertyTemplateFormLi();

        $("#" + context.getId("ulProperties")).append($formLi, $formAndConditionLi, $formColumnLi, $templateFormLi);


        $('#' + context.getId('addMatrixBtn')).unbind('click').bind('click', function () {
            var firstConditionId = context.getUUID();
            var secondConditionId = context.getUUID();
            context.createMatrixConditionRows(firstConditionId, secondConditionId);
            context.saveMatrixPropertiesData();

        });
        context.bindMatrixForms();


    }

    formBuilder.prototype.bindTemplateListInMatrix = function (currentComponent) {
        var context = this;
        var data = context.matrixData?.templateDropdownList;
        var $matrixTemplateList = $("#" + context.getId('matrixTemplateList'));
        $matrixTemplateList.empty();
        $matrixTemplateList.append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $matrixTemplateList.append(
                '<option value="' + data[i].id +
                '" data-defId="' + data[i].defId +
                '" data-templateId="' + data[i].templateId +
                '">' + data[i].displayName +
                '</option>'
            );
        }
        if (currentComponent?.configProperties?.selectedTemplate) {
            $matrixTemplateList.val(currentComponent.configProperties.selectedTemplate?.id);
        }
    };



    formBuilder.prototype.bindPropertyTemplateFormLi = function () {
        var context = this;

        var tempList = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        var labelTemp = $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_FORM')
        }).appendTo(tempList);

        var divTemp = $('<div>', {
            class: 'lib-input-group lib-position-relative',
        }).appendTo(tempList);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('matrixTemplateList')
        }).append($('<option>').attr('value', '')).appendTo(divTemp);

        return tempList;

    };

    formBuilder.prototype.createEvaluationResultConditionRow = function (data, result, colour, index) {
        var context = this;
        var id = context.getUUID();

        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p pl-0 pr-0 lib-display-flex lib-align-items-center lib-column-with-delete-field',
            id: id
        });

        var $inputData = $('<input>', {
            type: 'text',
            class: 'lib-form-control mr-3',
            value: data || '',
            placeholder: _common.getLocalizedValue('LBL_SCORE')
        });

        var $comparisonSign = $('<span>', {
            class: 'lib-form-control comparison-sign mr-3',
            text: '≥'
        }).css({
            width: '30px',
            textAlign: 'center',
            display: 'inline-block'
        });

        var $inputResult = $('<input>', {
            type: 'text',
            class: 'lib-form-control mr-3',
            value: result || '',
            placeholder: _common.getLocalizedValue('LBL_RESULT')
        });

        var $inputColour = $('<input>', {
            type: 'color',
            class: 'lib-form-control lib-col-3',
            value: colour || '#000000',
            placeholder: _common.getLocalizedValue('LBL_COLOUR')
        });

        var $divDelete = $('<div>', {
            class: 'lib-tool-delete row-delete-cross no-change-class mr-2',
            "data-id": id,
            title: _common.getLocalizedValue('LBL_DELETE')
        }).append($('<i>', {
            class: 'fa fa-times',
            'aria-hidden': 'true'
        }));

        $labelLi.append($inputData, $comparisonSign, $inputResult, $inputColour, $divDelete);
        $("#" + context.getId("evaluationResultConditions")).append($labelLi);

        $('#' + context.getId('addEvaluationResultBtn')).unbind("click").bind("click", function () {
            context.createEvaluationResultConditionRow("", "", "", index + 1);
            context.saveEvaluationResultPropertiesData();
        });

        $divDelete.unbind("click").bind("click", function () {

            if ($('#' + context.getId("evaluationResultConditions")).find('.row-delete-cross').length > 1) {
                $('#' + id).remove();
                context.saveEvaluationResultPropertiesData();
            }
        });
    };


    formBuilder.prototype.createMatrixConditionRows = function (firstConditionId, secondConditionId, value) {
        var context = this;
        var id = context.getUUID();
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p pl-0 pr-0 lib-display-flex lib-column-with-delete-field ',
            id: id
        });

        var $inputBox1 = $('<select>', {
            id: firstConditionId,
            class: 'lib-form-control first-condition',
            autoComplete: 'off',
        });

        var $span = $('<span>', {
            class: 'equal-sign-icon',
            text: ''
        });

        var $inputBox2 = $('<select>', {
            id: secondConditionId,
            class: 'lib-form-control second-condition',
            autoComplete: 'off',
        });

        var $divDelete = $('<div>', {
            class: "lib-tool-delete row-delete-cross no-change-class mr-2",
            "data-id": id,
            title: _common.getLocalizedValue('LBL_DELETE')
        }).append($('<i>', {
            class: "fa fa-times",
            "aria-hidden": "true"
        }));

        $labelLi.append($inputBox1, $span, $inputBox2, $divDelete);
        $("#" + context.getId("conditionColumns")).append($labelLi);
        context.bindColumnCondition(firstConditionId, context.matrixData?.conditionColumns, value?.firstCondition?.id);
        context.bindColumnCondition(secondConditionId, context.matrixData?.conditionColumns, value?.secondCondition?.id);
        $("#" + context.getId("conditionColumns")).find(".row-delete-cross").unbind("click").bind("click", function (id) {
            if ($('#' + context.getId("conditionColumns")).find('.row-delete-cross').length > 1) {
                var deleteId = $(this).attr("data-id");
                $('#' + deleteId).remove();
                context.saveMatrixPropertiesData();
            }
        });
    }

    formBuilder.prototype.bindMatrixCondition = function () {
        var context = this;
        var $formLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });

        var $rowLabel = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
        }).text(_common.getLocalizedValue('LBL_MATRIX_CONDITION'));

        var $button = $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-right-top',
            type: "button",
            id: context.getId('addMatrixBtn'),
            title: _common.getLocalizedValue('LBL_ROW_COLUMN')
        }).append($('<i>', {
            class: "fa fa-plus",
        }));


        var $conditionUlLi = $('<ul>', {
            class: 'lib-form-group no-change-class lib-prop-p pl-0 pr-0',
            id: context.getId("conditionColumns")
        });

        $formLi.append($rowLabel, $button);
        $formLi.append($conditionUlLi);


        return $formLi;
    };

    formBuilder.prototype.bindEvaluationResultCondition = function () {
        var context = this;
        var $formLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        var $rowLabel = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
        }).text(_common.getLocalizedValue('LBL_EVALUATION_RESULT_CONDITION'));

        var $button = $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-right-top',
            type: "button",
            id: context.getId('addEvaluationResultBtn'),
            title: _common.getLocalizedValue('LBL_ADD_EVALUATION_RESULT')
        }).append($('<i>', {
            class: "fa fa-plus",
        }));

        var $conditionUlLi = $('<ul>', {
            class: 'lib-form-group no-change-class lib-prop-p pl-0 pr-0',
            id: context.getId("evaluationResultConditions")
        });

        $formLi.append($rowLabel, $button);
        $formLi.append($conditionUlLi);

        $('#' + context.getId('addEvaluationResultBtn')).unbind('click').bind('click', function () {
            var data = '';
            var result = '';
            var color = '';
            context.createEvaluationResultConditionRow(data, result, color);
            context.saveEvaluationResultPropertiesData();
        });
        return $formLi;
    };


    formBuilder.prototype.bindPropertiesDisplayColumnLi = function () {
        var context = this;

        var formLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });

        var labelInt = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            text: _common.getLocalizedValue('LBL_DISPLAY_COLUMN')
        }).appendTo(formLi);

        $('<div>', {
            class: 'lib-w-100 lib-position-relative',
            id: context.getId('matrixColumnList')
        }).appendTo(formLi);
        return formLi;
    }

    formBuilder.prototype.bindPropertiesFormLi = function (id) {
        var context = this;

        var formLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });

        var labelInt = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            text: _common.getLocalizedValue('LBL_FORMS')
        }).appendTo(formLi);

        $('<div>', {
            class: 'lib-w-100 lib-position-relative',
            id: context.getId('matrixFormList')
        }).appendTo(formLi);

        return formLi;
    };


    formBuilder.prototype.bindDividerProperties = function () {
        var context = this;

        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi);
    }

    formBuilder.prototype.bindFieldProperties = function () {
        var context = this;

        $("#" + context.getId("ulProperties")).empty();
        var $labelLi = context.bindPropertyLabel();
        var $templateLi = context.bindDefinitionsForAp();
        var $attributeLi = context.bindFieldAttributeLi();

        $("#" + context.getId("ulProperties")).append($labelLi, $templateLi, $attributeLi);
        context.bindAutoPopulatedDef();
    }

    formBuilder.prototype.bindGridProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $gridTemplateLi = context.bindGridTemplateLi();
        var $gridAttributeLi = context.bindGridAttributeLi();
        var $redirectForm = context.bindGridRedirectForm();
        var $gridParentTemplateLi = context.bindGridParentTemplateLi();
        var $showInPopUpLi = context.bindShowInPopUpLi();
        var $enableEditMode = context.bindEnableEditModeLi();
        var $assignBox = context.bindAssignCheckBoxLi();
        var $scannerBox = context.bindScannerCheckBoxLi();
        var $eventLabelLi = context.bindEventLabelLi();
        var $eventMessageLi = context.bindEventMessageLi();
        var $eventIdLi = context.bindEventIdLi();
        var $popupLableLi = context.bindPropertyPopupLable();

        $("#" + context.getId("ulProperties")).append($gridParentTemplateLi, $gridTemplateLi, $gridAttributeLi, $redirectForm, $popupLableLi, $showInPopUpLi, $enableEditMode, $assignBox, $scannerBox, $eventLabelLi, $eventIdLi, $eventMessageLi);

        context.bindGridRedirectFormList();
        context.bindTemplateListInGrid();
        context.bindParentTemplateListInGrid();
    }

    formBuilder.prototype.bindHeadingProperties = function () {
        var context = this;

        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $headingPropertyStyle = context.bindPropertyHeadingStyle();
        var $headingPropertyAlign = context.bindPropertyHeadingAlign();
        var $dividerLi = context.bindHeadingDivider();

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $headingPropertyStyle, $dividerLi, $headingPropertyAlign);
    }

    formBuilder.prototype.bindEvaluationResultProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();
        var $labelLi = context.bindPropertyLabel();
        var $evaluationResultConditions = context.bindEvaluationResultCondition();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $showInWebLi = context.bindToggleProperty('showInWebId', 'LBL_SHOW_IN_WEB');
        $("#" + context.getId("ulProperties")).append($labelLi, $evaluationResultConditions, $mandatoryLi, $showInWebLi);
    }


    formBuilder.prototype.bindAutoNumberProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $paddingLengthLi = context.bindPropertyPaddingLength();
        var $shortTextLi = context.bindPropertysortText();
        var $prefixLi = context.createPrefixContainer();
        var $postfixLi = context.createPostfixContainer();
        var $primaryKeyLi = context.bindPropertyPrimary();
        var $showInWebLi = context.bindToggleProperty('showInWebId', 'LBL_SHOW_IN_WEB');
        var $showInMobLi = context.bindToggleProperty('showInMobId', 'LBL_SHOW_IN_MOB');
        var $previewLi = context.createPropertyPreview($prefixLi, $postfixLi, $paddingLengthLi);

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $paddingLengthLi, $prefixLi, $postfixLi, $previewLi, $shortTextLi, $primaryKeyLi, $showInWebLi, $showInMobLi);
        context.primaryKeyTrigger();
    }

    formBuilder.prototype.bindCalculatedFieldProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();
        $("#" + context.getId("ulProperties")).append(
            context.bindPropertyId(),
            context.bindPropertyLabel(),
            context.bindPropertyCalculatedFieldRadio(),
            context.bindPropertyNumberFormulaBuilder(),
            context.bindPropertyStringFormulaBuilder(),
            context.bindPropertyDistance(),
            context.bindPropertysortText(),
            context.bindPropertyMandatory(),
            context.bindToggleProperty('showInWebId', 'LBL_SHOW_IN_WEB'),
            context.bindToggleProperty('showInMobId', 'LBL_SHOW_IN_MOB'),
            context.bindToggleProperty('copyId', 'LBL_COPY')
        );
        context.bindCalculatedFieldDropDown();
    }

    formBuilder.prototype.bindNumberAndDecimalDropdown = function () {
        var context = this;
        var data = context.definitionList;
        $("#" + context.getId('selectNumberFields')).empty();

        $("#" + context.getId('selectStringFields')).empty();
        $("#" + context.getId('selectNumberFields')).append('<option value=""></option>');
        $("#" + context.getId('selectStringFields')).append('<option value=""></option>');
        data.forEach(function (item) {
            if (item.subType === "number" || item.subType === "decimal") {
                $("#" + context.getId('selectNumberFields')).append($("<option>").val(item.id).attr("ref_attr", item.id).text(item.label));
            } else if (item.subType === "text") {
                $("#" + context.getId('selectStringFields')).append($("<option>").val(item.id).attr("ref_attr", item.id).text(item.label));
            }
        });
    }

    formBuilder.prototype.bindCalculatedFieldDropDown = function () {
        var context = this;
        var data = context.definitionList;
        $("#" + context.getId('selectNumberFields')).empty().append('<option value=""></option>');
        $("#" + context.getId('selectStringFields')).empty().append('<option value=""></option>');
        $("#" + context.getId('selectFormDistance')).empty().append('<option value=""></option>');
        $("#" + context.getId('selectToDistance')).empty().append('<option value=""></option>');
        data.forEach(function (item) {
            if (item.subType === "number" || item.subType === "decimal") {
                $("#" + context.getId('selectNumberFields')).append(
                    $("<option>").val(item.id).attr("ref_attr", item.id).text(item.label)
                );
            }
            if (item.subType === "number" || item.subType === "decimal" || item.subType === "text" || item.subType == "textArea" || item.subType === "radio" || item.subType === "checkbox" || item.subType === "date" || item.subType == "dateTime" || item.subType === "select" || item.subType === "autonumber") {
                $("#" + context.getId('selectStringFields')).append(
                    $("<option>").val(item.id).attr("ref_attr", item.id).text(item.label)
                );
            }
            if (item.subType === "coordinate" && item.configProperties?.coordinateType == "POINT") {
                $("#" + context.getId('selectFormDistance')).append(
                    $("<option>").val(item.id).attr("ref_attr", item.id).text(item.label)
                );
                $("#" + context.getId('selectToDistance')).append(
                    $("<option>").val(item.id).attr("ref_attr", item.id).text(item.label)
                );
            }

            if (item.subType === "autoPopulated") {
                var definitionId = item.configProperties?.attributeId || "";
                var formLabels = [];
                if (definitionId) {
                    var dependentItem = data.find(d => d.id === definitionId);
                    context.templateList?.forEach(function (template) {
                        if (!dependentItem?.configProperties?.formId && template?.table_name === 'MATERIAL') {
                            template.definitions?.forEach(def => {
                                if (def.configProperties?.showInWeb && def.subType != "autonumber" && !formLabels.some(label => label.id === def.id && label.templateId === template.template_id)) {
                                    formLabels.push({ ...def, templateId: template.template_id, templateName: template.template_name });
                                }
                            });
                        }
                    });
                    if (dependentItem) {
                        var templateId = dependentItem.configProperties?.formId;
                        var selectedAttributesList = data?.find(def => def.subType === 'autoPopulated' && def.configProperties?.attributeId === dependentItem?.id)?.configProperties?.selectedAttributesList;
                        var templateDefinitions = context.templateList.find(t => t.template_id === templateId)?.definitions || [];
                        templateDefinitions.forEach(function (def) {
                            if (selectedAttributesList?.includes(def.id)) {
                                formLabels.push(def);
                            }
                        });
                    }
                }
                formLabels.forEach(function (labelDef) {
                    if (labelDef.subType === "number" || labelDef.subType === "decimal") {
                        $("#" + context.getId('selectNumberFields')).append(
                            $("<option>").val(labelDef.id).attr("ref_attr", item.id + (labelDef.templateId ? "_" + labelDef.templateId : "") + "_" + labelDef.id).text(item.label + (labelDef.templateName ? "." + labelDef.templateName : "") + "." + labelDef.label)
                        );
                    }
                    if (labelDef.subType === "number" || labelDef.subType === "decimal" || labelDef.subType === "text" || labelDef.subType == "textArea" || labelDef.subType === "radio" || labelDef.subType === "checkbox" || labelDef.subType === "date" || labelDef.subType == "dateTime" || labelDef.subType === "select") {
                        $("#" + context.getId('selectStringFields')).append(
                            $("<option>").val(labelDef.id).attr("ref_attr", item.id + (labelDef.templateId ? "_" + labelDef.templateId : "") + "_" + labelDef.id).text(item.label + (labelDef.templateName ? "." + labelDef.templateName : "") + "." + labelDef.label)
                        );
                    }
                });
            }
        });
    }

    formBuilder.prototype.bindSignatoryProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $shortTextLi = context.bindPropertysortText();
        var $mandatoryLi = context.bindPropertyMandatory();
        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $shortTextLi, $mandatoryLi);
    }

    formBuilder.prototype.bindTransactionProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();
        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $radioBtn = context.bindTransactionRadioBtn();
        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $radioBtn);
    }

    formBuilder.prototype.bindAdditionalInfoProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $createdByLi = context.bindPropertyCreatedBy();
        var $createdDateLi = context.bindPropertyCreatedDate();
        var $latestStatusLi = context.bindPropertyLatestStatus();

        $("#" + context.getId("ulProperties")).append($createdByLi, $createdDateLi, $latestStatusLi);
        context.bindInputLabelDiv();
    }

    formBuilder.prototype.bindInputLabelDiv = function () {
        var context = this;
        $("#" + context.getId('created_by')).unbind("change").bind("change", function () {
            if ($(this).is(":checked")) {
                $("#" + context.getId('created_by_label')).show();
            } else {
                $("#" + context.getId('created_by_label')).hide();
            }
        });
        $("#" + context.getId('created_date')).unbind("change").bind("change", function () {
            if ($(this).is(":checked")) {
                $("#" + context.getId('created_date_label')).show();
            } else {
                $("#" + context.getId('created_date_label')).hide();
            }
        });
        $("#" + context.getId('latest_status')).unbind("change").bind("change", function () {
            if ($(this).is(":checked")) {
                $("#" + context.getId('latest_status_label')).show();
            } else {
                $("#" + context.getId('latest_status_label')).hide();
            }
        });
    }

    formBuilder.prototype.bindFormTitleProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $formTitleLi = context.bindPropertyFormTitle();
        var $leftTitleLi = context.bindPropertyLeftTitle();
        var $rightTitleLi = context.bindPropertyRightTitle();
        $("#" + context.getId("ulProperties")).append($idLi, $formTitleLi, $leftTitleLi, $rightTitleLi);
        context.initializeFileUpload();
    }

    formBuilder.prototype.initializeFileUpload = function () {
        var context = this;
        $("#" + context.getId("leftInputTitleId")).unbind("change").bind("change", function () {
            var fileInput = $(this);
            var fileName = fileInput.prop('files')[0].name;

            $("#" + context.getId("leftUlTitleId")).find('li').find('span').text(fileName);
            context.toggleLoader(1);
            var eVal = this;
            setTimeout(function () {
                if (context.validateFile($(eVal).attr("id"))) {
                    $("#" + context.getId('leftTitleId')).show();
                    context.uploadFile($(eVal).attr("id"));
                }
            });
            context.toggleLoader(0);

        });
        $("#" + context.getId("rightInputTitleId")).unbind("change").bind("change", function () {
            var fileInput = $(this);
            var fileName = fileInput.prop('files')[0].name;
            $("#" + context.getId("rightUlTitleId")).find('li').find('span').text(fileName);
            context.toggleLoader(1);
            var eVal = this;
            setTimeout(function () {
                if (context.validateFile($(eVal).attr("id"))) {
                    $("#" + context.getId('rightTitleId')).show();
                    context.uploadFile($(eVal).attr("id"));
                }
            });
            context.toggleLoader(0);
        });
    }

    formBuilder.prototype.bindCommentProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $shortTextLi = context.bindPropertysortText();
        var $excludeFromMobile = context.bindPropertyExcludeFromMobile();

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $mandatoryLi, $shortTextLi, $excludeFromMobile);
    }

    formBuilder.prototype.bindNumberProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();
        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $defaultValueLi = context.bindPropertyDefaultValue();
        var $regexLi = context.bindPropertyRegex();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $shortTextLi = context.bindPropertysortText();
        var $excludeFromMobile = context.bindPropertyExcludeFromMobile();
        var $primaryKeyLi = context.bindPropertyPrimary();
        var $hiddenLi = context.bindPropertyHidden();
        var $readonlyLi = context.bindPropertyReadonly();
        var $uniqueKeyLi = context.bindPropertyUnique();
        var $cost = context.bindCostColLi();
        var $length = context.bindLengthColLi();
        var $showInWebLi = context.bindToggleProperty('showInWebId', 'LBL_SHOW_IN_WEB');
        var $showInMobLi = context.bindToggleProperty('showInMobId', 'LBL_SHOW_IN_MOB');
        var $copyLi = context.bindToggleProperty('copyId', 'LBL_COPY');
        var $expressionValidation = context.bindToggleProperty('expressionId', 'LBL_EXPRESSION_VALIDATION');
        var $expressionLi = context.bindPropertyNumberAndDecimalExpression();

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $defaultValueLi, $regexLi, $mandatoryLi, $shortTextLi, $excludeFromMobile, $hiddenLi, $primaryKeyLi, $readonlyLi, $uniqueKeyLi, $cost, $length, $showInWebLi, $showInMobLi, $copyLi, $expressionValidation, $expressionLi);
        context.bindNumberAndDecimalDropdown();
        context.primaryKeyTrigger();
        context.hiddenTrigger();
    }

    formBuilder.prototype.bindLocationProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $radioBtnLi = context.createLocationRadioContainer();
        var $shortTextLi = context.bindPropertysortText();

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $radioBtnLi, $shortTextLi);
    };

    formBuilder.prototype.bindUserProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $radioBtnLi = context.createUserRadioContainer();
        var $systemUserLi = context.createMapSystemUser();
        var $shortTextLi = context.bindPropertysortText();
        var $showInWebLi = context.bindToggleProperty('showInWebId', 'LBL_SHOW_IN_WEB');
        var $showInMobLi = context.bindToggleProperty('showInMobId', 'LBL_SHOW_IN_MOB');

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $radioBtnLi, $systemUserLi, $shortTextLi, $showInWebLi, $showInMobLi);
    };

    formBuilder.prototype.bindEvaluationProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $lovList = context.bindLovDropDownInEvaluation();
        var $scoreLabel = context.bindEvaluationScoreLabel();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $showInWebLi = context.bindToggleProperty('showInWebId', 'LBL_SHOW_IN_WEB');
        var $showInMobLi = context.bindToggleProperty('showInMobId', 'LBL_SHOW_IN_MOB');

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $lovList, $scoreLabel, $mandatoryLi, $showInWebLi);
        context.bindLovDropDownForEvaluation();
        context.addLovFromEvaluation();
    };

    formBuilder.prototype.bindCostColLi = function () {
        var context = this;

        var $costLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $costLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $costInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('cost')
        });

        var $costSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_COST')).attr("for", context.getId('cost'));

        $costLabel.append($costInput, $costSpan);
        return $costLi.append($costLabel);
    }

    formBuilder.prototype.bindLengthColLi = function () {
        var context = this;

        var $lengthLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $lengthLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $lengthInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('length')
        });

        var $lengthSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_LENGTH')).attr("for", context.getId('length'));

        $lengthLabel.append($lengthInput, $lengthSpan);
        return $lengthLi.append($lengthLabel);
    }

    formBuilder.prototype.bindHeadingDivider = function () {
        var context = this;

        var $quantityLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $quantityLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $quantityInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('headingDivider')
        });

        var $quantitySpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_WITH_DIVIDER')).attr("for", context.getId('headingDivider'));

        $quantityLabel.append($quantityInput, $quantitySpan);
        return $quantityLi.append($quantityLabel);

    }


    formBuilder.prototype.bindDecimalProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $defaultValueLi = context.bindPropertyDefaultValue();
        var $regexLi = context.bindPropertyRegex();
        var $decimalPlacesLi = context.bindPropertyDecimalPlaces();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $shortTextLi = context.bindPropertysortText();
        var $excludeFromMobile = context.bindPropertyExcludeFromMobile();
        var $hiddenLi = context.bindPropertyHidden();
        var $readonlyLi = context.bindPropertyReadonly();
        var $primaryKeyLi = context.bindPropertyPrimary();
        var $uniqueKeyLi = context.bindPropertyUnique();
        var $cost = context.bindCostColLi();
        var $length = context.bindLengthColLi();
        var $showInWebLi = context.bindToggleProperty('showInWebId', 'LBL_SHOW_IN_WEB');
        var $showInMobLi = context.bindToggleProperty('showInMobId', 'LBL_SHOW_IN_MOB');
        var $copyLi = context.bindToggleProperty('copyId', 'LBL_COPY');
        var $expressionValidation = context.bindToggleProperty('expressionId', 'LBL_EXPRESSION_VALIDATION');
        var $expressionLi = context.bindPropertyNumberAndDecimalExpression();

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $decimalPlacesLi, $defaultValueLi, $regexLi, $mandatoryLi, $shortTextLi, $excludeFromMobile, $hiddenLi, $cost, $length, $primaryKeyLi, $readonlyLi, $uniqueKeyLi, $showInWebLi, $showInMobLi, $copyLi, $expressionValidation, $expressionLi);
        context.bindNumberAndDecimalDropdown();
        context.primaryKeyTrigger();
        context.hiddenTrigger();
    }

    formBuilder.prototype.bindActionFormProperties = function () {
        var context = this;

        $("#" + context.getId("ulProperties")).empty();

        var $labelLi = context.bindPropertyLabel();
        var $userGroupLi = context.bindPropertyUserGroupLi('formUserGroupList');
        var $templateLi = context.bindPropertyTemplateLi();

        $("#" + context.getId("ulProperties")).append($labelLi, $userGroupLi, $templateLi);
        context.bindTemplateListInAction();
        context.addTemplate();
    }

    formBuilder.prototype.bindSelectDateProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $propertyLi2 = context.bindPropertyCurrentDate();
        var $propertyLi3 = context.bindPropertieNonEditDate();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $shortTextLi = context.bindPropertysortText();
        var $excludeFromMobile = context.bindPropertyExcludeFromMobile();
        var $showInWebLi = context.bindToggleProperty('showInWebId', 'LBL_SHOW_IN_WEB');
        var $showInMobLi = context.bindToggleProperty('showInMobId', 'LBL_SHOW_IN_MOB');
        var $copyLi = context.bindToggleProperty('copyId', 'LBL_COPY');
        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $propertyLi2, $propertyLi3, $mandatoryLi, $shortTextLi, $excludeFromMobile, $showInWebLi, $showInMobLi, $copyLi);
    }

    formBuilder.prototype.bindSelectDateAndTimeProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $propertyLi2 = context.bindPropertyCurrentDate();
        var $propertyLi3 = context.bindPropertieNonEditDate();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $shortTextLi = context.bindPropertysortText();
        var $excludeFromMobile = context.bindPropertyExcludeFromMobile();
        var $showInWebLi = context.bindToggleProperty('showInWebId', 'LBL_SHOW_IN_WEB');
        var $showInMobLi = context.bindToggleProperty('showInMobId', 'LBL_SHOW_IN_MOB');
        var $copyLi = context.bindToggleProperty('copyId', 'LBL_COPY');

        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $propertyLi2, $propertyLi3, $mandatoryLi, $shortTextLi, $excludeFromMobile, $showInWebLi, $showInMobLi, $copyLi);
    }

    formBuilder.prototype.bindRelationalDataInputProperties = function () {
        var context = this;
        var formLabelList = { "rdiRule": "LBL_RULE", "rdiAssignment": "LBL_ASSIGNMENT", "rdiAssignee": "LBL_ASSIGNEE", "rdiRuleAndAssignment": "LBL_RULE_AND_ASSIGNMENT", "rdiQualification": "LBL_QUALIFICATION" };
        $("#" + context.getId("ulProperties")).empty();
        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        $("#" + context.getId("ulProperties")).append($idLi, $labelLi);
        Object.keys(formLabelList).forEach(function (key) {
            var label = formLabelList[key];
            var $formDropdownLi = context.bindPropertyFormDropDown(key, label);
            $("#" + context.getId("ulProperties")).append($formDropdownLi);
            context.bindRdiDropdownForm(key);
        });
        var $sidesLi = context.bindPropertySidesLabel();
        $("#" + context.getId("ulProperties")).append($sidesLi);
        context.bindSidesListInRdi();
        context.bindNoOfAssigneeList();
    }

    formBuilder.prototype.bindSidesListInRdi = function () {
        var context = this;
        var ruleRdi = $("#" + context.getId('dropdownBox_rdiRule'));
        ruleRdi.on("change", function () {
            if ($(this).val()) {
                context.bindSidesLabelList();
                context.bindRdiDropdownSides($(this).val());
            }
        });
    }

    formBuilder.prototype.bindNoOfAssigneeList = function () {
        var context = this;
        $("#" + context.getId('dropdownBox_rdiAssignment')).on("change", function () {
            var selectedRuleId = $("#" + context.getId('dropdownBox_rdiRule')).val();
            context.bindNoOfAssigneeFormList($(this).val(), selectedRuleId);
            context.bindRdiDropdownNoOfAssignee($(this).val(), selectedRuleId);
        });
    }

    formBuilder.prototype.bindNoOfAssigneeFormList = function (templateId, ruleTemplateId) {
        var context = this;
        var assignmentLi = $("#" + context.getId("formDropdownDiv_rdiAssignment"));
        var $assigneeDropdownLi = context.bindPropertyNumberDropDown("rdiNoOfAssignee", "LBL_NO_OF_ASSIGNEE");
        assignmentLi.after($assigneeDropdownLi);
        if (ruleTemplateId) {
            context.bindRdiDropdownNoOfAssignee(templateId, ruleTemplateId);
        }
    }

    formBuilder.prototype.bindSidesLabelList = function () {
        var context = this;
        var ruleLi = $("#" + context.getId("formDropdownDiv_rdiRule"));
        var $sidesDropdownLi = context.bindPropertyNumberDropDown("rdiNoOfSides", "LBL_NO_OF_SIDES");
        ruleLi.after($sidesDropdownLi);
    }

    formBuilder.prototype.bindRdiDropdownSides = function (template_id) {
        var context = this;
        var template = context.filter(context.templateList, { template_id: template_id });
        var $sidesDropdownBox = $("#" + context.getId('dropdownBox_rdiNoOfSides'));
        $sidesDropdownBox.empty();
        $sidesDropdownBox.append('<option value=""></option>');
        if (template && template.length > 0) {
            var selectedItem = $("#" + context.getId("dropdownBox_rdiNoOfSides")).val();
            var dataList = context.rdiSidesAttributeDefinitionData(template[0].definitions, template[0].template_id, selectedItem?.toLowerCase());
            dataList.forEach(function (data) {
                $sidesDropdownBox.append("<option template_id = '" + data.value + "'" + " value='" + data.key + "'" + " data-id='" + data.key + "' __selected : '" + (data.__selected ? " selected" : "") + "'>" + data.name + "</option>");
            });
        }
        if ($("#" + context.getId('dropdownBox_rdiNoOfAssignee'))) {
            context.bindRdiDropdownNoOfAssignee($("#" + context.getId("dropdownBox_rdiAssignment")).val(), template_id);
        }
    }

    formBuilder.prototype.bindRdiDropdownNoOfAssignee = function (template_id, ruleTemplateId) {
        var context = this;
        var $assigneeDropdownBox = $("#" + context.getId('dropdownBox_rdiNoOfAssignee'));
        $assigneeDropdownBox.empty().append('<option value=""></option>');
        function appendData(template) {
            if (template && template.length > 0) {
                var selectedItem = $assigneeDropdownBox.val();
                var dataList = context.rdiAttributeDefinitionData(template[0].definitions, template[0].template_id, template[0].template_name, selectedItem?.toLowerCase());
                dataList.forEach(function (data) {
                    $assigneeDropdownBox.append("<option template_id = '" + data.value + "'" + " value='" + data.value + "_" + data.key + "'" + " data-id='" + data.key + "' __selected : '" + (data.__selected ? "selected" : "") + "'>" + data.name + "</option>");
                });
            }
        }
        appendData(context.filter(context.templateList, { template_id: template_id }));
        appendData(context.filter(context.templateList, { template_id: ruleTemplateId }));
    };

    formBuilder.prototype.bindRdiDropdownForm = function (id) {
        var context = this;
        var dataList = context.dropDownFormList;
        var $dropdownBox = $("#" + context.getId('dropdownBox_' + id));
        $dropdownBox.empty();
        $dropdownBox.append('<option value=""></option>');
        dataList.forEach(function (data) {
            $dropdownBox.append("<option value='" + data.id + "' data-tablename='" + data.tableName + "' data-type='" + data.type + "'>" + data.name + "</option>");
        });
    }

    formBuilder.prototype.bindDropDownProperties = function (id) {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $scannerLi = context.bindScannerCheckBoxLi();
        var $multiSelectLi = context.bindPropertyMultiSelect();
        var $shortTextLi = context.bindPropertysortText();
        var $excludeFromMobile = context.bindPropertyExcludeFromMobile();
        var $partitionPrimaryKeyLi = context.bindPartitionPrimaryProperty();
        var $radioBtnLi = context.createRadioButtonContainer();
        var $ddlSelectLi = context.createSelectDropdownContainer();
        var $serviceLi = context.createServiceContainer();
        var $formLi = context.createFormContainer();
        var $rangeFilterLi = context.bindPropertyEnableRangeFilter();
        var $rangeAddBtnLi = context.bindPropertiesEnabledRange();
        var $additionalConditionLi = context.bindPropertiesAdditionalCondition();
        var $uniqueKeyLi = context.bindPropertyUnique();
        var $showInWebLi = context.bindToggleProperty('showInWebId', 'LBL_SHOW_IN_WEB');
        var $showInMobLi = context.bindToggleProperty('showInMobId', 'LBL_SHOW_IN_MOB');
        var $copyLi = context.bindToggleProperty('copyId', 'LBL_COPY');
        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $radioBtnLi, $ddlSelectLi, $serviceLi, $formLi, $additionalConditionLi, $mandatoryLi, $multiSelectLi, $shortTextLi, $excludeFromMobile, $partitionPrimaryKeyLi, $uniqueKeyLi, $showInWebLi, $showInMobLi, $copyLi, $scannerLi, $rangeFilterLi, $rangeAddBtnLi);
        $("#" + context.getId('addLov')).unbind('click').click(function () {
            context.openListOfValuePopupModal($("#" + context.getId("ddlDropdownBox")).find(":selected").val());
        });
        var currentComponent = context.getComponent(id);
        context.bindLovDropDown();
        context.bindDropdownServiceUrl();
        context.bindDropdownForm();
        context.bindExistingDataDropdownForm();
        context.dataSourceTrigger();
        context.onFormDropDownChange(currentComponent);
        context.onDataExistenceDropDownChange();
        context.onToggleChange(id);
        $("#" + context.getId('addRangeBtn')).off('click').on('click', function () {
            var autoId = context.getUUID();
            var operatorId = context.getUUID();
            context.createRangeConditionRows(id, autoId);
            context.saveDropDownPropertiesData(currentComponent);
        });

        $("#" + context.getId('addConditionBtn')).off('click').on('click', function () {
            var autoId = context.getUUID();
            var operatorId = context.getUUID();
            context.createAdditionalConditionRows(id, autoId);
            context.saveDropDownPropertiesData(currentComponent);
        });

        $("#" + context.getId('addFormConditionBtn')).off('click').on('click', function () {
            var autoId = context.getUUID();
            var operatorId = context.getUUID();
            context.createFormConditionRows(id, autoId);
            context.saveDropDownPropertiesData(currentComponent);
        });
        context.primaryKeyTrigger();
    };

    formBuilder.prototype.onToggleChange = function (id) {
        var context = this;
        $("#" + context.getId('enableRangeFilter')).on('change', function () {
            if ($(this).prop('checked')) {
                $("#" + context.getId("rangeColumns")).empty();
                $("#" + context.getId('rangeColumnLi')).show();
                var autoId = context.getUUID();
                context.createRangeConditionRows(id, autoId);
            } else {
                $("#" + context.getId("rangeColumns")).empty();
                $("#" + context.getId('rangeColumnLi')).hide();
            }
        });
    }

    formBuilder.prototype.onFormDropDownChange = function (currentComponent) {
        var context = this;
        $("#" + context.getId('formDropdown')).off('change').on('change', function () {
        debugger
            if (context.onChangeDropdownProperties(context.getComponent(context.componentId))) {
                return false;
            } else {
                $("#" + context.getId("rangeColumns")).empty();
                if ($("#" + context.getId("formDropdown")).val() == 'MATERIAL') {
                    $("#" + context.getId("multiselectId")).prop('checked', false);
                    $("#" + context.getId("multiSelectLi")).hide();
                } else {
                    $("#" + context.getId("multiSelectLi")).show();
                }
                $(this).val() ? context.bindFilteredAttributesForForm($(this).val()) : $("#" + context.getId("formAttributesList")).empty();
                context.bindFormConditions();
            }
            context.bindEditAdditionalCondition(currentComponent);
        });
    };

    formBuilder.prototype.onDataExistenceDropDownChange = function () {
        var context = this;
        $("#" + context.getId('existingDataFormDropdown')).off('change').on('change', function () {
            $(this).val() ? context.bindFilteredAttributesForDataExistence($(this).val()) : $("#" + context.getId("dataExistAttributeList")).empty();
        })
    }

    formBuilder.prototype.bindFilteredAttributesForDataExistence = function (templateId, selectedAttrId) {
        var context = this;
        var templateData = context.filter(context.templateList, { template_id: templateId })[0];
        var $attrDropdownForDataExistence = $("#" + context.getId("dataExistAttributeList"));
        $attrDropdownForDataExistence.empty();
        var definitionsList = templateData ? templateData.definitions : [];

        definitionsList.forEach(item => {
            if (item.subType === 'select' && item.configProperties?.dataSourceType == "FORM" && !item.configProperties?.multiSelect) {
                $attrDropdownForDataExistence.append('<option value="' + item.id + '"' + (item.id === selectedAttrId ? ' selected' : '') + '>' + item.label + '</option>');
            }
        });
    };

    formBuilder.prototype.bindFilteredAttributesForDataExistenceAdditional = function (templateId, selectedAttrId, autoId) {
        var context = this;
        var templateData = context.filter(context.templateList, { template_id: templateId })[0];
        var $attrDropdownForDataExistence = $("#" + context.getId(autoId + "dataExistAttributeList"));
        $attrDropdownForDataExistence.empty();
        var definitionsList = templateData ? templateData.definitions : [];

        definitionsList.forEach(item => {
            if (item.subType === 'select' && item.configProperties?.dataSourceType == "FORM" && !item.configProperties?.multiSelect) {
                $attrDropdownForDataExistence.append('<option value="' + item.id + '"' + (item.id === selectedAttrId ? ' selected' : '') + '>' + item.label + '</option>');
            }
        });
    };

    formBuilder.prototype.bindFilteredAttributesForForm = function (templateId, selectedAttrId) {
        var context = this;
        var templateData = context.filter(context.templateList, { template_id: templateId })[0];
        var $formAttributesList = $("#" + context.getId("formAttributesList"));
        $formAttributesList.empty();
        var definitionsList = templateData ? templateData.definitions : [];
        var primaryKeyLabels = definitionsList.filter(item => item.key === 'P').map(item => item.label);
        var primaryKeyLabelString = primaryKeyLabels.length > 0 ? _common.getLocalizedValue('LBL_PRIMARY_KEY') + ` (${primaryKeyLabels.join(', ')})` : _common.getLocalizedValue('LBL_PRIMARY_KEY');
        $formAttributesList.append('<option value="">' + primaryKeyLabelString + '</option>')
        definitionsList.forEach(item => {
            if (item.configProperties?.uniqueKey && item.subType != 'select') {
                $formAttributesList.append('<option value="' + item.id + '"' + (item.id === selectedAttrId ? ' selected' : '') + '>' + item.label + '</option>');
            }
        });
    }

    formBuilder.prototype.selectedFormAndBindRangeCon = function (currentComponent) {
        var context = this;
        context.bindEditRangeCondition(currentComponent);
    }

    formBuilder.prototype.bindFileUploadProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $idLi = context.bindPropertyId();
        var $labelLi = context.bindPropertyLabel();
        var $mandatoryLi = context.bindPropertyMandatory();
        var $imageOnlyLi = context.bindPropertyImageOnly();
        $("#" + context.getId("ulProperties")).append($idLi, $labelLi, $mandatoryLi, $imageOnlyLi);
    };

    formBuilder.prototype.bindActionProperties = function () {
        var context = this;
        $("#" + context.getId("ulProperties")).empty();

        var $labelLi = context.bindPropertyLabel();
        var $otherEmailLi = context.bindPropertyOtherEmail();
        var $fieldLevelPermissionLi = context.bindPropertyFieldLevelPermissionLi();
        var $userGroupLi = context.bindPropertyUserGroupLi('userGroupList');
        var $assignLi = context.bindPropertyAssign();
        var $confirmationLi = context.bindPropertyConfirmation();
        var $commentLi = context.bindPropertyComment();
        var $checkpoint = context.bindCheckpointPermission();
        var $notification = context.bindNotificationPermission();
        var $initialLi = context.bindPropertyInitialStateLi();
        var $nextStateLi = context.bindPropertyNextStateLi();
        var $stageLi = context.bindPropertyStageLi();
        var $onlyNavigationLi = context.bindOnlyNavigationLi();
        var $redirectForm = context.bindRedirectForm();
        var $emailtemplateForm = context.bindEmailTemplateForm();
        var $emailGroupLi = context.bindPropertyEmailGroupLi('emailGroupList');
        var $businessEventLi = context.bindPropertyBusinessEventLi();
        $("#" + context.getId("ulProperties")).append($labelLi, $fieldLevelPermissionLi, $userGroupLi, $assignLi, $confirmationLi, $commentLi, $checkpoint, $initialLi, $nextStateLi, $stageLi, $notification, $emailtemplateForm, $emailGroupLi, $otherEmailLi);

        context.addInitialState();
        context.addNextState();
        context.addTemplate();
        context.bindRedirectFormList();
        context.bindEmailTemplateFormList();
        context.bindState('ddlNextState');
        context.bindBusinessEventListInAction();
    }
    formBuilder.prototype.bindEmailTemplateForm = function () {
        var context = this;

        var tempList = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });

        var divContainer = $('<div>', {
            class: 'lib-form-group'
        }).appendTo(tempList);

        $('<small>', {
            class: 'lib-form-label lib-text-normal',
            text: _common.getLocalizedValue('LBL_THE_EMAIL_WILL_ALWAYS_BE_SENT_TO_THE_ASSIGNEE')
        }).appendTo(divContainer);
        $('<label>', {
            for: context.getId('emailtemplateForm'),
            text: _common.getLocalizedValue('LBL_EMAIL_TEMPLATE')
        }).appendTo(divContainer);

        var divTemp = $('<div>', {
            class: 'lib-input-group lib-position-relative',
        }).appendTo(tempList);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('emailtemplateForm')
        }).append($('<option>').attr('value', '')).appendTo(divTemp);

        return tempList;
    }
    formBuilder.prototype.bindRedirectForm = function () {
        var context = this;

        var tempList = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        var labelTemp = $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_REDIRECT_FORM')
        }).appendTo(tempList);

        var divTemp = $('<div>', {
            class: 'lib-input-group lib-position-relative',
        }).appendTo(tempList);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('redirectForm')
        }).append($('<option>').attr('value', '')).appendTo(divTemp);

        return tempList;
    }
    formBuilder.prototype.bindPropertyEmailGroupLi = function (id) {
        var context = this;

        var tempList = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_EMAIL_GROUPS')
        }).appendTo(tempList);

        $('<div>', {
            class: 'lib-flex-100',
            id: context.getId(id)
        }).appendTo(tempList);

        return tempList;
    }


    formBuilder.prototype.bindOnlyNavigationLi = function () {
        var context = this;

        var $navigationLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $navigationLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $navigationInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('navigation')
        });

        var $navigationSpan = $('<label>').addClass('lib-form-check-box-label ml-2').text(_common.getLocalizedValue('LBL_ONLY_FOR_NAVIGATION')).attr("for", context.getId('navigation'));

        $navigationLabel.append($navigationInput, $navigationSpan);
        return $navigationLi.append($navigationLabel);

    }
    formBuilder.prototype.bindEmailTemplateFormList = function () {
        var context = this;
        var data = context.emailTemplateList;
        $("#" + context.getId('emailtemplateForm')).empty();
        $("#" + context.getId('emailtemplateForm')).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId('emailtemplateForm')).append("<option value=\"" + data[i].emailTemplateId + "\">" + data[i].templateName + "</option>");
        }
    }
    formBuilder.prototype.bindRedirectFormList = function () {
        var context = this;
        var data = context.templateList;
        $("#" + context.getId('redirectForm')).empty();
        $("#" + context.getId('redirectForm')).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId('redirectForm')).append("<option value=\"" + data[i].template_id + "\">" + data[i].template_name + "</option>");
        }
    }

    formBuilder.prototype.bindLovDropDown = function (id) {
        var context = this;
        var data = context.lovList;
        $("#" + context.getId('ddlDropdownBox')).empty();
        $("#" + context.getId('ddlDropdownBox')).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId('ddlDropdownBox')).append("<option value=\"" + data[i].id + "\">" + data[i].lovName + "</option>");
        }
        $("#" + context.getId("ddlDropdownBox")).val(id);
    }

    formBuilder.prototype.bindDropdownServiceUrl = function () {
        var context = this;
        var dropdownServiceUrl = context.dropdownServiceUrl;
        $("#" + context.getId('selectApi')).empty();
        $("#" + context.getId('selectApi')).append('<option value=""></option>');
        for (var data of dropdownServiceUrl) {
            $("#" + context.getId('selectApi')).append("<option value=\"" + data.key + "\">" + data.value + "</option>");
        }
    }

    formBuilder.prototype.bindAutoPopulatedDef = function () {
        var context = this;
        $("#" + context.getId('autoPopulatedDef')).empty();
        $("#" + context.getId('autoPopulatedDef')).append('<option value=""></option>');
        for (var def of context.definitionList) {
            if (def.subType == "select" && def.configProperties.dataSourceType === 'FORM' && !def.configProperties.multiSelect) {
                $("#" + context.getId('autoPopulatedDef')).append($("<option></option>").attr("value", def.id).attr("data-templateId", def.configProperties?.formId).attr("tableName", def.configProperties?.featureId).text(def.label));
            }
        }
        $("#" + context.getId('autoPopulatedDef')).on("change", function () {
            var template_id = $(this).find(':selected').attr('data-templateId');
            var table_name = $(this).find(':selected').attr('tableName');
            context.validateAutoPopulatedFormChange(template_id, table_name);
        });

        $("#" + context.getId('fieldAttributeList')).on("change", function () {
            context.validateAutoPopulatedAttributeChange();
        });
    }

    formBuilder.prototype.validateAutoPopulatedFormChange = function (template_id, table_name) {
        var context = this;
        var currentDefinition = context.filter(context.definitionList, { id: context.componentId })[0];
        var isUsed = context.definitionList.some(def =>
            def.subType === "calculatedfields" &&
            def.configProperties?.usedColumns?.some(column => {
                const parts = column.split("_");
                return parts[0] === context.componentId;
            })
        );
        if (isUsed) {
            var dependsOnDefinition = currentDefinition ? context.definitionList.find(def => def.id === currentDefinition.configProperties.attributeId) : null;
            if (dependsOnDefinition) {
                context.msgList.push(_common.getLocalizedValue("LBL_ATTRIBUTE_IS_USED_IN_THE_EXPRESSION").format([dependsOnDefinition.label]));
                context.bindMessage('WARNING');
                $("#" + context.getId('autoPopulatedDef')).val(dependsOnDefinition.id);
            }
            return;
        } else {
            template_id || table_name ? context.bindFieldFormAttributeDropdown(template_id, table_name) : $("#" + context.getId('fieldAttributeList')).empty();
        }
    }

    formBuilder.prototype.validateAutoPopulatedAttributeChange = function (selectedId, template_id, table_name) {
        var context = this;
        var nonSelectedIds = context.objects.selectedAttributesList?.dataList.filter(item => !item.__selected).map(item => item.key);
        var usedInExpression = false;
        nonSelectedIds.forEach(id => {
            var isUsed = context.definitionList.some(def => def.subType === "calculatedfields" && def.configProperties?.usedColumns?.some(column => column.includes(id)));
            if (isUsed) {
                var selectedItem = context.objects.selectedAttributesList?.dataList.find(item => item.key === id);
                if (selectedItem) {
                    selectedItem.__selected = true;
                    $(`input[key="${id}"]`).prop("checked", true);
                    $("#" + context.getId("fieldAttributeList_txtSearchWrapper")).val("");
                }
                context.msgList.push(_common.getLocalizedValue("LBL_SELECTED_ATTRIBUTE_IS_USED_IN_THE_EXPRESSION"));
                context.bindMessage('WARNING');
            }
        });
    }

    formBuilder.prototype.bindMatrixForms = function () {
        var context = this;
        var multiSelectData = [];
        $("#" + context.getId('matrixFormList')).empty();
        context.templateList.forEach(data => {
            if (data['template_id'] && data['template_name']) {
                var json = {};
                json = data;
                json["j_Id"] = data['template_id'].toString();
                multiSelectData.push(json);
            }
        });
        var definition = [];
        var objMultiSelect = new jList.listing(context.modifySearchableData(multiSelectData, context.selectedFormList), context.getId('matrixFormList'));
        objMultiSelect.setListStyle({ isForm: true, search: true, applyBtn: true, cancelBtn: false, select: true, selectAll: false, deleteBtn: false, idCol: 'template_id', valueCol: 'template_name', listingType: "", theme: "", applyBtnLabel: "Apply", singleSelect: false });
        objMultiSelect.setCallbacks({
            apply: function (fullData) { context.onChangeOfMatrixForm(context.getComponent(context.componentId)) }, remove: null, select: null, cancel: function () { context.modal(0) }
        });
        objMultiSelect.bind();
        context.objects["matrixForms"] = objMultiSelect;
    }

    formBuilder.prototype.onChangeOfMatrixForm = function (currentComponent) {
        var context = this;
        var templateIdsList = context.objects["matrixForms"].getMultiSelectedValuesJList();
        var val = templateIdsList.join(",");
        context.toggleLoader(1);
        formBuilder.post(context.host.anarServiceUrl + 'api/getdataformatrix', templateIdsList, function (result) {
            context.matrixData = result.data;
            context.toggleLoader(0);
            var multiSelectData = [];
            var displayColList = result.data?.displayColumns;
            $("#" + context.getId('matrixColumnList')).empty();
            displayColList.forEach(data => {
                if (data['id'] && data['value']) {
                    var json = {};
                    json = data;
                    json["j_Id"] = data['id'].toString();
                    multiSelectData.push(json);
                }
            });

            var objMultiSelect = new jList.listing(context.modifySearchableData(multiSelectData, context.selectedDisplayColumn), context.getId('matrixColumnList'));
            objMultiSelect.setListStyle({ isForm: true, search: true, applyBtn: true, cancelBtn: false, select: true, selectAll: false, deleteBtn: false, idCol: 'id', valueCol: 'value', listingType: "", theme: "", applyBtnLabel: "Apply", singleSelect: false });
            objMultiSelect.setCallbacks({
                apply: function (fullData) { context.savePropertyData() }, remove: null, select: null, cancel: function () { context.modal(0) }
            });
            objMultiSelect.bind();
            context.objects["matrixColumns"] = objMultiSelect;
            context.bindTemplateListInMatrix(currentComponent);
            context.bindEditMatrixCondition(currentComponent);

        });



    }

    formBuilder.prototype.bindEditMatrixCondition = function (currentComponent) {
        var context = this;
        $("#" + context.getId("conditionColumns")).empty();
        if (currentComponent?.configProperties.matrixCondition) {
            $("#" + context.getId("conditionColumns")).empty();
            $(currentComponent?.configProperties.matrixCondition).each(function (key, value) {
                var firstConditionId = context.getUUID();
                var secondConditionId = context.getUUID();
                context.createMatrixConditionRows(firstConditionId, secondConditionId, value);
            })
        }
    }

    formBuilder.prototype.bindComparisonOperatorsDropDown = function (definitionId, operatorId, selectedId) {
        var context = this;
        var comparisonOperators = [
            { id: 'EQUAL_TO', operatorName: 'Equal to' },
            { id: 'NOT_EQUAL_TO', operatorName: 'Not equal to' },
            { id: 'GREATER_THAN', operatorName: 'Greater than' },
            { id: 'LESS_THAN', operatorName: 'Less than' },
            { id: 'GREATER_THAN_OR_EQUAL_TO', operatorName: 'Greater than or equal to' },
            { id: 'LESS_THAN_OR_EQUAL_TO', operatorName: 'Less than or equal to' },
            { id: 'BETWEEN', operatorName: 'Between' }
        ];

        var $dropdown = $("#" + operatorId);
        $dropdown.empty();
        for (var i = 0; i < comparisonOperators.length; i++) {
            $dropdown.append("<option value=\"" + comparisonOperators[i].id + "\">" + comparisonOperators[i].operatorName + "</option>");
        }

        if (selectedId) {

            $("#" + operatorId).val(selectedId);
            if (selectedId === "BETWEEN") {
                $($dropdown).parent().find('.between-condition').show();
            }


        }

        $("#" + operatorId).unbind("change").bind("change", function () {

            if ($(this).val() === "BETWEEN") {
                $(this).parent().find('.between-condition').show();
            } else {
                $(this).parent().find('.between-condition').hide();
            }
        });


    };

    formBuilder.prototype.bindAndOrDiv = function (definitionId, conditionId, selectedId) {
        var context = this;
        var andOrOperator = [
            { id: 'OR', operatorName: 'Or' },
            { id: 'AND', operatorName: 'And' }
        ];

        var $dropdown = $("#" + conditionId);
        $dropdown.empty();
        for (var i = 0; i < andOrOperator.length; i++) {
            $dropdown.append("<option value=\"" + andOrOperator[i].id + "\">" + andOrOperator[i].operatorName + "</option>");
        }

        if (selectedId) {
            $("#" + conditionId).val(selectedId);


        }

    }


    formBuilder.prototype.bindLeftRangeColumnCondition = function (definitionId, id, selectedId) {
        var context = this;
        $("#" + id).empty();
        var attributeList = [];
        var allowedSubTypes = ['text', 'number', 'decimal', 'autoPopulated'];
        context.definitionList.forEach(item => {
            if (allowedSubTypes.includes(item.subType)) {
                if (item.subType === 'autoPopulated') {
                    var defList = context.filter(context.templateList, { template_id: item.configProperties?.template_id })[0]?.definitions;
                    var selectedAttrList = item.configProperties?.selectedAttributesList;
                    defList?.forEach(def => {
                        if (selectedAttrList.includes(def.id)) {
                            var json = {};
                            json['id'] = item.id + '_' + def.id;
                            json['attrId'] = item.id;
                            json['label'] = item.label + '.' + def.label;
                            json['apId'] = def.id;
                            attributeList.push(json);
                        }
                    });
                } else {
                    var json = {};
                    json['id'] = item.id;
                    json['attrId'] = item.id;
                    json['label'] = item.label;
                    json['apId'] = "";
                    attributeList.push(json);
                }
            }
        });
        attributeList.forEach(list => {
            $("#" + id).append(
                '<option value="' + list.id + '" data-attrid="' + list.attrId + '" data-apid="' + list.apId + '" >' +
                list.label +
                '</option>'
            );
        });
        if (selectedId) {
            $("#" + id).val(selectedId);
        }
    };


    formBuilder.prototype.bindRightRangeColumnCondition = function (definitionId, id, selectedId) {
        var context = this;
        $("#" + id).empty();
        var allowedSubTypes = ['text', 'number', 'decimal'];
        var selectedForm = $("#" + context.getId("formDropdown")).val();
        var templateData = context.filter(context.templateList, { template_id: selectedForm });
        var attributeList = [];
        var definitionsList = templateData && templateData[0] ? templateData[0].definitions : [];
        definitionsList.forEach(item => {
            if (allowedSubTypes.includes(item.subType)) {
                var json = {};
                json['id'] = item.id;
                json['attrId'] = item.id;
                json['label'] = templateData[0]?.template_name + "." + item.label;
                json['apId'] = "";
                attributeList.push(json);
            }
        });

        attributeList.forEach(list => {
            $("#" + id).append(
                '<option value="' + list.id + '" data-attrid="' + list.attrId + '" data-apid="' + list.apId + '" >' +
                list.label +
                '</option>'
            );
        });

        if (selectedId) {
            $("#" + id).val(selectedId);
        }

    }


    formBuilder.prototype.bindColumnCondition = function (id, conditionColumns, selectedId) {
        var context = this;
        $("#" + id).empty();
        conditionColumns?.forEach(list => {
            $("#" + id).append(
                '<option value="' + list.id + '" data-type="' + list.type + '" data-selectedAttrFormId="' + list.selectedAttrFormId + '" data-attrId="' + list.attrId + '" data-templateId="' + list.templateId + '">' +
                list.value +
                '</option>'
            );

        });
        if (selectedId) {
            $("#" + id).val(selectedId);


        }

    }

    formBuilder.prototype.modifySearchableData = function (dataList, selectedValues) {
        var context = this;
        var jListData = [];

        dataList.forEach(data => {
            var jList = data
            jList.__selected = selectedValues?.includes(jList.j_Id);
            jListData.push(jList);
        });
        return jListData;
    }

    formBuilder.prototype.formSelectedColumns = function (selectedMatrixColumns, displayColList) {
        var context = this;
        return displayColList.map(function (template) {
            return {
                key: template.id,
                value: template.value,
                __selected: selectedMatrixForms.includes(template.id)
            };
        });
    }

    formBuilder.prototype.formListMultiSelectDropDown = function (selectedMatrixForms) {
        var context = this;
        return context.templateList.map(function (template) {
            return {
                key: template.template_id,
                value: template.template_name,
                __selected: selectedMatrixForms.includes(template.template_id)
            };
        });
    }


    formBuilder.prototype.bindDropdownForm = function () {
        var context = this;
        var dataList = context.dropDownFormList;
        $("#" + context.getId('formDropdown')).empty();
        $("#" + context.getId('formDropdown')).append('<option value=""></option>');
        for (var data of dataList) {
            $("#" + context.getId('formDropdown')).append("<option value='" + data.id + "' data-tablename='" + data.tableName + "' data-type='" + data.type + "'>" + data.name + "</option>");
        }
    }

    formBuilder.prototype.bindExistingDataDropdownForm = function () {
        var context = this;
        var dataList = context.dropDownFormList;
        $("#" + context.getId('existingDataFormDropdown')).empty();
        $("#" + context.getId('existingDataFormDropdown')).append('<option value=""></option>');
        for (var data of dataList) {
            $("#" + context.getId('existingDataFormDropdown')).append("<option value='" + data.id + "' data-tablename='" + data.tableName + "' data-type='" + data.type + "'>" + data.name + "</option>");
        }
    }

    formBuilder.prototype.bindExistingDataDropdownFormAdditional = function (autoId, selectedId) {
        var context = this;
        debugger
        var formId = $("#" + context.getId('formDropdown')).find(":selected").val();
        var dataList = [];
        context.templateList.forEach(function (template) {
            template.definitions.forEach(function (definition) {
                var configProperties = definition.configProperties || {};
                if (definition.subType === 'select' && configProperties.formId === formId && template.template_id != context.template_id) {
                    dataList.push({
                        id: template.template_id,
                        name: template.template_name,
                        tableName: template.table_name,
                        type: definition.type,
                    });
                }
            });
        });

        $("#" + context.getId(autoId + 'existingDataFormDropdown')).empty();
        $("#" + context.getId(autoId + 'existingDataFormDropdown')).append('<option value=""></option>');
        for (var data of dataList) {
            $("#" + context.getId(autoId + 'existingDataFormDropdown')).append("<option value='" + data.id + "' data-tablename='" + data.tableName + "' data-type='" + data.type + "'>" + data.name + "</option>");
        }
        debugger
        selectedId ? $("#" + context.getId(autoId + 'existingDataFormDropdown')).val(selectedId) : null;
    }

    formBuilder.prototype.bindFieldTemplatePropertiesLi = function () {
        var context = this;

        var tempList = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        var labelTemp = $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_FORM')
        }).appendTo(tempList);

        var divTemp = $('<div>', {
            class: 'lib-input-group lib-position-relative',
        }).appendTo(tempList);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('fieldTemplateList')
        }).append($('<option>').attr('value', '')).appendTo(divTemp);

        return tempList;
    }

    formBuilder.prototype.bindDefinitionsForAp = function () {
        var context = this;

        var tempList = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        var labelTemp = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            text: _common.getLocalizedValue('LBL_AUTO_POPULATED_ON')
        }).appendTo(tempList);

        var divTemp = $('<div>', {
            class: 'lib-input-group lib-position-relative',
        }).appendTo(tempList);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('autoPopulatedDef')
        }).append($('<option>').attr('value', '')).appendTo(divTemp);

        return tempList;
    }

    formBuilder.prototype.bindContextualFieldPropertiesLi = function () {
        var context = this;

        var $contextualLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $contextualLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $contextualInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('contextual_field')
        });

        var $contextualSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_CONTEXTUAL_FIELD')).attr("for", context.getId('contextual_field'));

        $contextualLabel.append($contextualInput, $contextualSpan);
        return $contextualLi.append($contextualLabel);
    }

    formBuilder.prototype.bindGridRedirectForm = function () {
        var context = this;

        var tempList = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        var labelTemp = $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_REDIRECT_FORM')
        }).appendTo(tempList);

        var divTemp = $('<div>', {
            class: 'lib-input-group lib-position-relative',
        }).appendTo(tempList);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('gridRedirectForm')
        }).append($('<option>').attr('value', '')).appendTo(divTemp);

        return tempList;
    }

    formBuilder.prototype.bindLookupType = function () {
        var context = this;
        var tempList = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        var labelTemp = $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_TYPE'),
        }).appendTo(tempList);

        var divTemp = $('<div>', {
            class: 'lib-input-group lib-position-relative',
        }).appendTo(tempList);

        var select = $('<select>', {
            class: 'lib-form-control',
            id: context.getId('ddlLookupType')
        }).appendTo(divTemp);

        $('<option>', {
            value: ''
        }).appendTo(select);

        $('<option>', {
            value: 'MATERIAL',
            text: _common.getLocalizedValue('LBL_MATERIAL')
        }).appendTo(select);

        return tempList;
    }

    formBuilder.prototype.bindLookupLov = function () {
        var context = this;
        var tempList = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        var labelTemp = $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_LOV'),
        }).appendTo(tempList);

        var divTemp = $('<div>', {
            class: 'lib-input-group lib-position-relative',
        }).appendTo(tempList);

        var select = $('<select>', {
            class: 'lib-form-control',
            id: context.getId('ddlLookupLov')
        }).appendTo(divTemp);
        return tempList;
    }

    formBuilder.prototype.bindChildDependentLookup = function () {
        var context = this;
        var tempList = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        var labelTemp = $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_CHILD_DEPENDENT'),
        }).appendTo(tempList);

        var divTemp = $('<div>', {
            class: 'lib-input-group lib-position-relative',
        }).appendTo(tempList);

        var select = $('<select>', {
            class: 'lib-form-control',
            id: context.getId('childDependentLookup')
        }).appendTo(divTemp);
        return tempList;
    }

    formBuilder.prototype.bindGridParentTemplateLi = function () {
        var context = this;
        var tempList = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        var labelTemp = $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_PARENT_FORM')
        }).appendTo(tempList);

        var divTemp = $('<div>', {
            class: 'lib-input-group lib-position-relative',
        }).appendTo(tempList);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('parentGridTemplateList')
        }).append($('<option>').attr('value', '')).appendTo(divTemp);
        return tempList;

    }

    formBuilder.prototype.bindGridTemplateLi = function () {
        var context = this;
        var tempList = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        var labelTemp = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            text: _common.getLocalizedValue('LBL_FORM')
        }).appendTo(tempList);

        var divTemp = $('<div>', {
            class: 'lib-input-group lib-position-relative',
        }).appendTo(tempList);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('gridTemplateList')
        }).append($('<option>').attr('value', '')).appendTo(divTemp);

        return tempList;

    }

    formBuilder.prototype.bindFieldAttributeLi = function () {
        var context = this;
        var fieldTemplateLi = $('<li>', {
            style: 'display:none;',
            id: context.getId('formFieldLi'),
            class: 'lib-form-group no-change-class lib-prop-p',
        });

        var labelInt = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            text: _common.getLocalizedValue('LBL_FORM_ATTRIBUTE')
        }).appendTo(fieldTemplateLi);

        $('<div>', {
            class: 'lib-w-100 lib-position-relative',
            id: context.getId('fieldAttributeList')
        }).appendTo(fieldTemplateLi);

        return fieldTemplateLi;

    }

    formBuilder.prototype.bindGridAttributeLi = function () {
        var context = this;

        var gridTemplateLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });

        var labelInt = $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_FORM_ARRTIBUTE')
        }).appendTo(gridTemplateLi);

        $('<div>', {
            class: 'lib-w-100 lib-position-relative',
            id: context.getId('gridAttributeList')
        }).appendTo(gridTemplateLi);

        return gridTemplateLi;
    }

    formBuilder.prototype.bindPropertyTemplateLi = function () {
        var context = this;

        var tempList = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        var labelTemp = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            text: _common.getLocalizedValue('LBL_FORM')
        }).appendTo(tempList);

        var divTemp = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative',
        }).appendTo(tempList);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('templateList')
        }).append($('<option>').attr('value', '')).appendTo(divTemp);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon',
            type: "button",
            id: context.getId('addNewTemplateBtn')
        }).append($('<i>', {
            class: "fa fa-plus",
        })).appendTo(divTemp);

        return tempList;

    };

    formBuilder.prototype.bindPropertyUserGroupLi = function (id) {
        var context = this;

        var tempList = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_USER_GROUPS')
        }).appendTo(tempList);

        $('<div>', {
            class: 'lib-flex-100',
            id: context.getId(id)
        }).appendTo(tempList);

        return tempList;
    };

    formBuilder.prototype.bindPropertyBusinessEventLi = function () {
        var context = this;

        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label ',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_BUSINESS_EVENT'));

        var $labelInput = $('<select>', {
            type: 'text',
            id: context.getId('ddlBusinessEvent'),
            class: 'lib-form-control'
        }).append($('<option>').attr('value', ''));

        return $labelLi.append($label, $labelInput);
    };
    formBuilder.prototype.bindPropertyStageLi = function () {
        var context = this;

        var initialStage = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            style: 'display:none;'
        });
        var labelInt = $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_STAGE')
        }).appendTo(initialStage);

        var divIntStage = $('<div>', {
            class: 'lib-input-group lib-position-relative',
        }).appendTo(initialStage);

        $('<div>', {
            class: 'lib-w-100 lib-position-relative',
            id: context.getId('ddlStage')
        }).appendTo(divIntStage);


        return initialStage;
    };


    formBuilder.prototype.bindPropertyNextStateLi = function () {
        var context = this;

        var initialState = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        var labelInt = $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue("LBL_NEXT_STATE")
        }).appendTo(initialState);

        var divIntState = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative',
        }).appendTo(initialState);

        $('<select>', {
            class: 'lib-form-control',
            id: context.getId('ddlNextState')
        }).append($('<option>').attr('value', '')).appendTo(divIntState);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon',
            type: "button",
            id: context.getId('addNextState')
        }).append($('<i>', {
            class: "fa fa-plus",
        })).appendTo(divIntState);

        return initialState;
    };

    formBuilder.prototype.bindPropertyInitialStateLi = function () {
        var context = this;

        var initialState = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });
        var labelInt = $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_INITIAL_STATE')
        }).appendTo(initialState);

        var divIntState = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative',
        }).appendTo(initialState);

        $('<div>', {
            class: 'lib-w-100 lib-position-relative',
            id: context.getId('ddlInitialState')
        }).appendTo(divIntState);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon',
            type: "button",
            id: context.getId('addIntState')
        }).append($('<i>', {
            class: "fa fa-plus",
        })).appendTo(divIntState);

        return initialState;
    };

    formBuilder.prototype.bindPropertyFieldLevelPermissionLi = function () {
        var context = this;

        var fieldLevelPermissionLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
        });

        var labelInt = $('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('LBL_FIELD_LEVEL_PERMISSION')
        }).appendTo(fieldLevelPermissionLi);

        $('<div>', {
            class: 'lib-w-100 lib-position-relative',
            id: context.getId('fieldLabelPermission')
        }).appendTo(fieldLevelPermissionLi);

        return fieldLevelPermissionLi;
    };

    formBuilder.prototype.bindPropertyCurrentDate = function () {
        var context = this;

        var $propertyLi2 = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label2 = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $checkbox2 = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('currentDateId')
        });

        var $span2 = $('<label>').addClass('lib-form-check-box-label ml-2').text(_common.getLocalizedValue('LBL_CURRENT_DATE')).attr("for", context.getId('currentDateId'));
        $label2.append($checkbox2, $span2);
        return $propertyLi2.append($label2);
    }

    formBuilder.prototype.bindPropertyCurrentMonth = function () {
        var context = this;

        var $propertyLi2 = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label2 = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $checkbox2 = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('currentMonthId')
        });

        var $span2 = $('<label>').addClass('lib-form-check-box-label ml-2').text(_common.getLocalizedValue('LBL_CURRENT_AND_FOLLOWING_ONLY')).attr("for", context.getId('currentMonthId'));
        $label2.append($checkbox2, $span2);
        return $propertyLi2.append($label2);
    }

    formBuilder.prototype.bindPropertieNonEditDate = function () {
        var context = this;

        var $propertyLi3 = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label3 = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $checkbox3 = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('nonEditDate')
        });

        var $span3 = $('<label>').addClass('lib-form-check-box-label ml-2').text(_common.getLocalizedValue('LBL_NON_EDITABLE')).attr("for", context.getId('nonEditDate'));

        $label3.append($checkbox3, $span3);
        return $propertyLi3.append($label3);
    }

    formBuilder.prototype.bindState = function (id) {
        var context = this;
        var statusList = context.statusList;
        $("#" + context.getId(id)).empty();
        $("#" + context.getId(id)).append('<option value=""></option>');
        statusList.forEach(list => {
            $("#" + context.getId(id)).append("<option value=\"" + list.id + "\">" + list.statusName + "</option>");
        });
    }



    formBuilder.prototype.bindStateType = function () {
        var context = this;
        var stateType = context.getStateType();
        $("#" + context.getId('addNewAbbreviation')).empty();
        $("#" + context.getId('addNewAbbreviation')).append('<option value=""></option>');
        for (var data of stateType) {
            $("#" + context.getId('addNewAbbreviation')).append("<option value=\"" + data.id + "\">" + data.value + "</option>");
        }
    }

    formBuilder.prototype.getStateType = function () {
        return [{
            "id": "ACCEPT",
            "value": "Accepted"
        }, {
            "id": "REJECT",
            "value": "Rejected"
        }]
    }

    formBuilder.prototype.bindTemplateInitialResult = function () {
        var context = this;
        var statusList = context.finalStatusMultiSelectData(context.finalStatus);
        var objMultiSelect = new multiSelect(context.getId('final_status'));
        objMultiSelect.setDataList(statusList ? statusList : []);
        objMultiSelect.bind();
        context.objects.finalStatus = objMultiSelect;
    }

    formBuilder.prototype.finalStatusMultiSelectData = function (finalStatus) {
        var context = this;
        return context.statusList?.map(function (status) {
            return {
                key: status.id,
                value: status.statusName,
                __selected: finalStatus.includes(String(status.id))
            };
        });
    }

    formBuilder.prototype.bindTemplateFinalResult = function () {
        var context = this;
        var statusList = context.statusList;
        $("#" + context.getId("result_status")).empty();
        $("#" + context.getId("result_status")).append('<option value=""></option>');
        statusList.forEach(list => {
            $("#" + context.getId("result_status")).append("<option value=\"" + list.id + "\">" + list.statusName + "</option>");
        });
    }

    formBuilder.prototype.bindFeatureType = function (featureList) {
        var context = this;
        var data = featureList;
        $("#" + context.getId('ddl_feature_type')).empty();
        $("#" + context.getId('ddl_feature_type')).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId('ddl_feature_type')).append("<option value=\"" + data[i].feature + "\">" + data[i].feature_label + "</option>");
        }

    }

    formBuilder.prototype.bindLovDropDownForRadio = function (id) {
        var context = this;
        var data = context.lovList;
        $("#" + context.getId('ddlSelectLov')).empty();
        $("#" + context.getId('ddlSelectLov')).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId('ddlSelectLov')).append("<option value=\"" + data[i].id + "\">" + data[i].lovName + "</option>");
        }
        $("#" + context.getId("ddlSelectLov")).val(id);
    }

    formBuilder.prototype.bindLovDropDownForLookup = function () {
        var context = this;
        var data = context.lovList;
        $("#" + context.getId('ddlLookupLov')).empty();
        $("#" + context.getId('ddlLookupLov')).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId('ddlLookupLov')).append("<option value=\"" + data[i].id + "\">" + data[i].lovName + "</option>");
        }
    }

    formBuilder.prototype.bindDependentLookup = function () {
        var context = this;
        var data = context.definitionList;
        $("#" + context.getId('childDependentLookup')).empty();
        $("#" + context.getId('childDependentLookup')).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId('childDependentLookup')).append("<option value=\"" + data[i].id + "\">" + data[i].label + "</option>");
        }
    }

    formBuilder.prototype.bindLovDropDownForCheckpoint = function (id) {
        var context = this;
        var data = context.lovList;
        $("#" + context.getId('ddlSelectLovCheckpoint')).empty();
        $("#" + context.getId('ddlSelectLovCheckpoint')).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId('ddlSelectLovCheckpoint')).append("<option value=\"" + data[i].id + "\">" + data[i].lovName + "</option>");
        }
        $("#" + context.getId("ddlSelectLovCheckpoint")).val(id);
    }

    formBuilder.prototype.bindLovDropDownForCheckbox = function (id) {
        var context = this;
        var data = context.lovList;
        $("#" + context.getId('ddlSelectLovCheckbox')).empty();
        $("#" + context.getId('ddlSelectLovCheckbox')).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId('ddlSelectLovCheckbox')).append("<option value=\"" + data[i].id + "\">" + data[i].lovName + "</option>");
        }
        $("#" + context.getId("ddlSelectLovCheckbox")).val(id);
    }

    formBuilder.prototype.bindLovDropDownForEvaluation = function (id) {
        var context = this;
        var data = context.lovList;
        $("#" + context.getId('ddlSelectLovEvaluation')).empty();
        $("#" + context.getId('ddlSelectLovEvaluation')).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId('ddlSelectLovEvaluation')).append("<option value=\"" + data[i].id + "\">" + data[i].lovName + "</option>");
        }
        $("#" + context.getId("ddlSelectLovEvaluation")).val(id);
    }

    formBuilder.prototype.bindStatusName = function (eVal, id) {
        var context = this;

        $("#" + context.getId(id)).val($(eVal).attr('data-name'));
        $("#" + context.getId(id)).attr('data-id', $(eVal).attr('data-id'));
        $("#" + context.getId(id + "_suggestion")).hide();
        context.savePropertyData();
    }

    formBuilder.prototype.bindTemplateListInAction = function () {
        var context = this;
        var data = context.templateList;
        $("#" + context.getId('templateList')).empty();
        $("#" + context.getId('templateList')).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId('templateList')).append("<option value=\"" + data[i].template_id + "\">" + data[i].template_name + "</option>");
        }
    }

    formBuilder.prototype.bindFieldFormAttributeDropdown = function (template_id, table_name) {
        var context = this;
        var combinedDataMap = new Map();
        var templates = context.templateList.filter(template => template.template_id === template_id || template.table_name === table_name);
        $("#" + context.getId('fieldAttributeList')).empty();
        if (templates.length > 0) {
            templates.forEach(function (template) {
                var definitionList = template.definitions;
                (template_id || template.table_name != 'MATERIAL') ? $("#" + context.getId('formFieldLi')).show() : $("#" + context.getId('formFieldLi')).hide();
            });
            var template = templates[0];
            if (template && template.definitions.length > 0) {
                var objMultiSelect = new multiSelect(context.getId('fieldAttributeList'));
                objMultiSelect.setDataList(context.attributeDefinitionData(template.definitions, context.selectedAttributesList));
                objMultiSelect.setCallbacks({ dragCallback: function () { context.savePropertyData(); } });
                objMultiSelect.bind();
                context.objects.selectedAttributesList = objMultiSelect;
            }
        }
    };

    formBuilder.prototype.bindDataList = function (dataMap, selectedDataList, isMaterial) {
        var context = this;
        var dataList = [];
        dataMap.forEach(function (value, key) {
            var data = {
                key: key,
                value: value,
                __selected: selectedDataList.includes(key)
            };
            if (!data.__selected) {
                dataList.push(data);
            }
        });
        var selectedDataList = context.selectedAttributesListForMultiSelect(dataMap, selectedDataList, isMaterial)
        return selectedDataList.concat(dataList);
    }

    formBuilder.prototype.bindGridRedirectFormList = function () {
        var context = this;
        var data = context.templateList;
        $("#" + context.getId('gridRedirectForm')).empty();
        $("#" + context.getId('gridRedirectForm')).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId('gridRedirectForm')).append("<option value=\"" + data[i].template_id + "\">" + data[i].template_name + "</option>");
        }
    }

    formBuilder.prototype.bindTemplateListInGrid = function () {
        var context = this;
        var data = context.templateList;
        $("#" + context.getId('gridTemplateList')).empty();
        $("#" + context.getId('gridTemplateList')).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId('gridTemplateList')).append("<option value=\"" + data[i].template_id + "\">" + data[i].template_name + "</option>");
        }
        $("#" + context.getId('gridTemplateList')).on("change", function () {
            if ($(this).val()) {
                context.bindGridFormAttributeDropdown($(this).val());
            }
        });

    }

    formBuilder.prototype.bindQuerySet = function (id) {
        var context = this;
        var data = context.querySetList;
        $("#" + context.getId(id)).empty();
        $("#" + context.getId(id)).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId(id)).append("<option value=\"" + data[i] + "\">" + data[i] + "</option>");
        }
    }


    formBuilder.prototype.bindParentTemplateListInGrid = function () {
        var context = this;
        var data = context.templateList;
        $("#" + context.getId('parentGridTemplateList')).empty();
        $("#" + context.getId('parentGridTemplateList')).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId('parentGridTemplateList')).append("<option value=\"" + data[i].template_id + "\">" + data[i].template_name + "</option>");
        }
    }


    formBuilder.prototype.bindGridFormAttributeDropdown = function (template_id) {
        var context = this;
        var template = context.filter(context.templateList, { template_id: template_id });
        $("#" + context.getId('gridAttributeList')).empty();
        if (template && template[0]) {
            var objMultiSelect = new multiSelect(context.getId('gridAttributeList'));
            objMultiSelect.setDataList(context.attributeDefinitionData(template[0].definitions, context.selectedGridAttributeList));
            objMultiSelect.setCallbacks({ dragCallback: function () { context.savePropertyData() } })
            objMultiSelect.bind();
            context.objects.selectedGridAttributeList = objMultiSelect;
        }
    }


    formBuilder.prototype.attributeDefinitionData = function (definitionList, selectedAttributeList) {
        var context = this;
        var dataList = [];
        var listToAdd = [];
        listToAdd.push("checkbox", "DROPDOWN", "select", "radio", "text", "number", "decimal", "textArea", "date", "dateTime");
        for (var i = 0; i < definitionList.length; i++) {
            var definition = definitionList[i];
            if (listToAdd.includes(definition.subType)) {
                var data = {
                    key: definition.id,
                    value: definition.label,
                    __selected: selectedAttributeList.includes(definition.id)
                };
                if (!data.__selected) {
                    dataList.push(data);
                }
            }
        }
        var selectedDataList = context.selectedAttributesListForMultiSelect(definitionList, selectedAttributeList)
        return selectedDataList.concat(dataList);
    }

    formBuilder.prototype.rdiSidesAttributeDefinitionData = function (definitionList, templateId, selectedItem) {
        var context = this;
        var dataList = [];
        for (var i = 0; i < definitionList.length; i++) {
            var definition = definitionList[i];
            if (definition.subType == "number") {
                var data = {
                    key: definition.id,
                    value: templateId,
                    name: definition.label,
                    __selected: definition.label.toLowerCase() === selectedItem
                };
                if (!data.__selected) {
                    dataList.push(data);
                }
            }
        }
        return dataList;
    }

    formBuilder.prototype.rdiAttributeDefinitionData = function (definitionList, templateId, selectedFormName, selectedItem) {
        var context = this;
        var dataList = [];
        for (var i = 0; i < definitionList.length; i++) {
            var definition = definitionList[i];
            if (definition.subType == "number") {
                var data = {
                    key: definition.id,
                    value: templateId,
                    name: selectedFormName + "." + definition.label,
                    __selected: definition.label.toLowerCase() === selectedItem
                };
                if (!data.__selected) {
                    dataList.push(data);
                }
            }
        }
        return dataList;
    }

    formBuilder.prototype.selectedAttributesListForMultiSelect = function (definitionList, selectedAttributeList, isMaterial) {
        var context = this;
        var selectedDataList = [];
        if (selectedAttributeList.length > 0) {
            selectedAttributeList.forEach(data => {
                if (isMaterial) {
                    def = definitionList.get(data);
                    if (def) {
                        selectedDataList.push({
                            key: data,
                            value: def,
                            __selected: true
                        });
                    }
                } else {
                    var def = context.filter(definitionList, { id: data })[0];
                    if (def) {
                        var data = {
                            key: def.id,
                            value: def.label,
                            __selected: true
                        };
                        selectedDataList.push(data);
                    }
                }
            })
        }
        return selectedDataList;
    }


    formBuilder.prototype.bindBusinessEventListInAction = function () {
        var context = this;
        var data = context.setting.businessEventList;
        $("#" + context.getId('ddlBusinessEvent')).empty();
        $("#" + context.getId('ddlBusinessEvent')).append('<option value=""></option>');
        for (var i = 0; i < data.length; i++) {
            $("#" + context.getId('ddlBusinessEvent')).append("<option value=\"" + data[i].key + "\">" + data[i].value + "</option>");
        }
    }


    formBuilder.prototype.enableNonEditDate = function () {
        var context = this;
        $("#" + context.getId("currentDateId")).unbind("change").bind("change", function () {
            if ($("#" + context.getId("currentDateId")).prop('checked')) {
                $("#" + context.getId("nonEditDate")).prop("disabled", false);
            } else {
                $("#" + context.getId("nonEditDate")).prop('checked', false);
                $("#" + context.getId("nonEditDate")).prop("disabled", true);
            }
        });
    }

    formBuilder.prototype.checkSpecialCharacter = function (id) {
        var context = this;
        $("#" + context.getId(id)).keypress(function (e) {
            var txt = String.fromCharCode(e.which);
            var val = $('#' + context.getId(id)).val();
            if (!txt.match(/[0-8]|10/)) {
                return false;
            }
        });
        $("#" + context.getId(id)).unbind("change").bind("change", function (e) {
            var val = $('#' + context.getId(id)).val();
            if (val > 8) {
                $('#' + context.getId(id)).val(8);
            }
        });
    }
    formBuilder.prototype.bindPropertyDecimalPlaces = function () {
        var context = this;
        var decimalPlaces = $('<input>', {
            type: 'number',
            id: context.getId('decimalPlacesId'),
            placeholder: _common.getLocalizedValue('LBL_DECIMAL_PLACES_BETWEEEN_1_AND_16'),
            class: "lib-form-control",
            min: "0",
            max: "8",
            autoComplete: "off",
        });
        decimalPlaces.on('keydown', function (event) {
            return ['ArrowLeft', 'ArrowRight', 'Backspace'].includes(event.code) ? true : !/^[e.+-]*$/.test(event.key);
        });
        return $('<li>', {
            class: "lib-form-group no-change-class lib-prop-p"
        }).append(
            $('<label>', {
                class: "lib-form-label ",
                "data-tkey": context.getUUID(),
                text: _common.getLocalizedValue('LBL_DECIMAL_PLACES')
            }),
            decimalPlaces
        );
    }
    formBuilder.prototype.bindPropertyHeadingStyle = function () {
        var context = this;
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after ',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_STYLE'));

        var $selectHeading = $('<select>', {
            id: context.getId('ddlheading'),
            class: 'lib-form-control'
        }).append(
            $('<option>', { value: 'H1' }).text(_common.getLocalizedValue('LBL_HEADING_1')),
            $('<option>', { value: 'H2', selected: 'selected' }).text(_common.getLocalizedValue('LBL_HEADING_2')),
            $('<option>', { value: 'H3' }).text(_common.getLocalizedValue('LBL_HEADING_3'))
        );

        var $divIntState = $('<div>', {
            class: 'lib-input-group lib-position-relative',
        }).append($selectHeading);

        return $labelLi.append($label, $divIntState);
    };


    formBuilder.prototype.bindPropertyHeadingAlign = function () {
        var context = this;
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_ALIGN'));


        var $selectAlign = $('<select>', {
            id: context.getId('ddlalign'),
            class: 'lib-form-control'
        }).append(
            $('<option>', { value: 'LEFT' }).text(_common.getLocalizedValue('LBL_LEFT')),
            $('<option>', { value: 'MIDDLE', selected: 'selected' }).text(_common.getLocalizedValue('LBL_MIDDLE')),
            $('<option>', { value: 'RIGHT' }).text(_common.getLocalizedValue('LBL_RIGHT'))
        );

        var $divIntState = $('<div>', {
            class: 'lib-input-group lib-position-relative',
        }).append($selectAlign);

        return $labelLi.append($label, $divIntState);
    };

    formBuilder.prototype.bindPropertyLabel = function () {
        var context = this;
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_LABEL'));

        var $labelInput = $('<input>', {
            type: 'text',
            id: context.getId('checklabelId'),
            class: 'lib-form-control',
            autoComplete: 'off',
        });

        return $labelLi.append($label, $labelInput);
    }

    formBuilder.prototype.bindEvaluationScoreLabel = function () {
        var context = this;
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_SCORE_LABEL'));

        var $labelInput = $('<input>', {
            type: 'text',
            id: context.getId('evalScoreLabelId'),
            class: 'lib-form-control',
            autoComplete: 'off',
        });

        return $labelLi.append($label, $labelInput);
    }

    formBuilder.prototype.bindPropertyOtherEmail = function () {
        var context = this;
        var $otherEmailLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $divContainer = $('<div>', {
            class: 'lib-form-group'
        }).appendTo($otherEmailLi);

        var $otherEmail = $('<label>', {
            class: 'lib-form-label',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_OTHER_EMAIL'));

        var $OtherEmailInput = $('<input>', {
            type: 'text',
            id: context.getId('otherEmailId'),
            class: 'lib-form-control',
            autoComplete: 'off'
        });
        $divContainer.append($otherEmail, $OtherEmailInput);

        $('<small>', {
            class: 'lib-form-label lib-text-normal',
            text: _common.getLocalizedValue('LBL__EMAIL_ADDRESSES_COMMA_SEPERATED')
        }).appendTo($divContainer);

        return $otherEmailLi;
    }

    formBuilder.prototype.bindPropertyId = function () {
        var context = this;
        var isCustom = 'lib-hide';
        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p ' + isCustom
        });

        var $label = $('<label>', {
            class: 'lib-form-label ',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_ID'));

        var $labelInput = $('<input>', {
            type: 'text',
            id: context.getId('customId'),
            class: 'lib-form-control',
            autoComplete: 'off',
        });

        return $labelLi.append($label, $labelInput);
    }

    formBuilder.prototype.bindPropertyMandatory = function () {
        var context = this;

        var $mandatoryLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $mandatoryLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $mandatoryInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('checkBoxId')
        });

        var $mandatorySpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_MANDATORY')).attr("for", context.getId('checkBoxId'));

        $mandatoryLabel.append($mandatoryInput, $mandatorySpan);
        return $mandatoryLi.append($mandatoryLabel);
    }

    formBuilder.prototype.bindPropertyImageOnly = function () {
        var context = this;
        var $imageOnlyLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $imageOnlyLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $imageOnlyInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('imageOnlyId')
        });

        var $imageOnlySpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_IMAGE_ONLY')).attr("for", context.getId('imageOnlyId'));

        $imageOnlyLabel.append($imageOnlyInput, $imageOnlySpan);
        return $imageOnlyLi.append($imageOnlyLabel);
    }

    formBuilder.prototype.bindPropertyMultiSelect = function () {
        var context = this;
        var $multiSelectLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('multiSelectLi')
        });
        var $multiSelectLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $multiSelectInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('multiselectId')
        });

        var $multiSelectSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_MULTI_SELECT')).attr("for", context.getId('multiselectId'));

        $multiSelectLabel.append($multiSelectInput, $multiSelectSpan);
        return $multiSelectLi.append($multiSelectLabel);
    }

    formBuilder.prototype.bindPropertyCreatedBy = function () {
        var context = this;
        var $createdByLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        })
        var $createdByLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch',
            id: context.getId('created_by_toggle')
        });
        var $createdByTextDiv = $('<div>', {
            id: context.getId('created_by_label')
        });
        var $createdByInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('created_by')
        });

        var $createdByInputLabel = $('<input>', {
            type: 'text',
            class: 'lib-form-control',
            autoComplete: 'off',
            value: _common.getLocalizedValue('LBL_CREATED_BY'),
            id: context.getId('created_by_text')
        });

        var $createdBySpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_CREATED_BY')).attr("for", context.getId('created_by'));
        var $createdByInputSpan = $('<label>').addClass("lib-form-label").text(_common.getLocalizedValue('LBL_CREATED_BY_LABEL')).attr("for", context.getId('created_by_text'));

        $createdByLabel.append($createdByInput, $createdBySpan);
        $createdByTextDiv.append($createdByInputSpan, $createdByInputLabel);
        return $createdByLi.append($createdByLabel, $createdByTextDiv);
    }

    formBuilder.prototype.bindPropertyCreatedDate = function () {
        var context = this;
        var $createdDateLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        })
        var $createdDateLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch',
            id: context.getId('created_date_toggle')
        });
        var $createdDateTextDiv = $('<div>', {
            id: context.getId('created_date_label')
        });
        var $createdDateInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('created_date')
        });
        var $createdDateInputLabel = $('<input>', {
            type: 'text',
            class: 'lib-form-control',
            autoComplete: 'off',
            value: _common.getLocalizedValue('LBL_CREATED_DATE'),
            id: context.getId('created_date_text')
        });
        var $createdDateSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_CREATED_DATE')).attr("for", context.getId('created_date'));
        var $createdDateInputSpan = $('<label>').addClass("lib-form-label").text(_common.getLocalizedValue('LBL_CREATED_DATE_LABEL')).attr("for", context.getId('created_date_text'));

        $createdDateLabel.append($createdDateInput, $createdDateSpan);
        $createdDateTextDiv.append($createdDateInputSpan, $createdDateInputLabel);
        return $createdDateLi.append($createdDateLabel, $createdDateTextDiv);
    }

    formBuilder.prototype.bindPropertyLatestStatus = function () {
        var context = this;
        var $latestStatusLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        })
        var $latestStatusLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch',
            id: context.getId('latest_status_toggle')
        });
        var $latestStatusTextDiv = $('<div>', {
            id: context.getId('latest_status_label')
        });
        var $latestStatusInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('latest_status')
        });
        var $latestStatusInputLabel = $('<input>', {
            type: 'text',
            class: 'lib-form-control',
            autoComplete: 'off',
            value: _common.getLocalizedValue('LBL_LATEST_STATUS'),
            id: context.getId('latest_status_text')
        });

        var $latestStatusSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_LATEST_STATUS')).attr("for", context.getId('latest_status'));
        var $latestStatusInputSpan = $('<label>').addClass("lib-form-label").text(_common.getLocalizedValue('LBL_LATEST_STATUS_LABEL')).attr("for", context.getId('latest_status_text'));

        $latestStatusLabel.append($latestStatusInput, $latestStatusSpan);
        $latestStatusTextDiv.append($latestStatusInputSpan, $latestStatusInputLabel)
        return $latestStatusLi.append($latestStatusLabel, $latestStatusTextDiv);
    }

    formBuilder.prototype.bindPropertysortText = function () {
        var context = this;

        var $shortTextLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $shortTextLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $shortTextInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('shorttextId')
        });

        var $shortTextSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_SHORT_TEXT')).attr("for", context.getId('shorttextId'));

        $shortTextLabel.append($shortTextInput, $shortTextSpan);
        return $shortTextLi.append($shortTextLabel);
    }
    formBuilder.prototype.createMapSystemUser = function () {
        var context = this;

        var $systemUserLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $systemUserLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $systemUserInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('mapSystemUser')
        });

        var $systemUserSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_MAP_SYSTEM_USER')).attr("for", context.getId('mapSystemUser'));

        $systemUserLabel.append($systemUserInput, $systemUserSpan);
        return $systemUserLi.append($systemUserLabel);
    }

    formBuilder.prototype.bindPropertyAutoGeneratedQr = function () {
        var context = this;
        var $autoGeneratedQrLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $autoGeneratedQrLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $autoGeneratedQrInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('autoGeneratedQrId')
        });

        var $autoGeneratedQrSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue("LBL_AUTO_GENERATED_QR")).attr("for", context.getId('autoGeneratedQrId'));
        $autoGeneratedQrLabel.append($autoGeneratedQrInput, $autoGeneratedQrSpan);
        return $autoGeneratedQrLi.append($autoGeneratedQrLabel);
    }

    formBuilder.prototype.bindPropertyExcludeFromMobile = function () {
        var context = this;

        var $excludeFromMobile = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $excludeFromMobileLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $excludeFromMobileInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('excludeFromMobId')
        });

        var $excludeFromMobileSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_EXCLUDE_FROM_MOB')).attr("for", context.getId('excludeFromMobId'));

        $excludeFromMobileLabel.append($excludeFromMobileInput, $excludeFromMobileSpan);
        return $excludeFromMobile.append($excludeFromMobileLabel);
    }

    formBuilder.prototype.bindPartitionPrimaryProperty = function () {
        var context = this;

        var $shortTextLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p lib-hide',
            id: context.getId('primaryKeyPartitionLi')
        });

        var $shortTextLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $shortTextInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('primaryKeyPartition')
        });

        var $shortTextSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_PRIMARY_PARTITION_KEY')).attr("for", context.getId('primaryKeyPartition'));

        $shortTextLabel.append($shortTextInput, $shortTextSpan);
        return $shortTextLi.append($shortTextLabel);
    }

    formBuilder.prototype.bindFormPropertiesAllowMultipleEntries = function () {
        var context = this;

        var $allowMultipleLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $allowMultipleLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $allowMultipleInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('allowMultiple')
        });

        var $allowMultipleSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_ALLOW_MULTIPLE_ENTRIES')).attr("for", context.getId('allowMultiple'));

        $allowMultipleLabel.append($allowMultipleInput, $allowMultipleSpan);
        return $allowMultipleLi.append($allowMultipleLabel);
    }


    formBuilder.prototype.bindPropertyPrimary = function () {
        var context = this;

        var $primaryKeyLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $primaryKeyLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $primaryKeyInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('primaryKeyId')
        });

        var $primaryKeySpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_PRIMARY_KEY')).attr("for", context.getId('primaryKeyId'));

        $primaryKeyLabel.append($primaryKeyInput, $primaryKeySpan);
        return $primaryKeyLi.append($primaryKeyLabel);

    }

    formBuilder.prototype.bindPropertyUnique = function () {
        var context = this;

        var $uniqueKeyLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $uniqueKeyLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $uniqueKeyInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('uniqueKeyId')
        });

        var $uniqueKeySpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_UNIQUE_KEY')).attr("for", context.getId('uniqueKeyId'));

        $uniqueKeyLabel.append($uniqueKeyInput, $uniqueKeySpan);
        return $uniqueKeyLi.append($uniqueKeyLabel);

    }

    formBuilder.prototype.bindToggleProperty = function (id, label) {
        var context = this;

        var $toggleKeyLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $toggleKeyLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $toggleKeyInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId(id)
        });

        var $toggleKeySpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue(label)).attr("for", context.getId(id));

        $toggleKeyLabel.append($toggleKeyInput, $toggleKeySpan);
        return $toggleKeyLi.append($toggleKeyLabel);
    }

    formBuilder.prototype.bindEnableEditModeLi = function () {
        var context = this;
        var $enableEditModeLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $enableEditModeLiLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $enableEditModeLiInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('enableEditMode')
        });

        var $enableEditModeLiSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_ENABLE_EDIT_MODE')).attr("for", context.getId('enableEditMode'));

        $enableEditModeLiLabel.append($enableEditModeLiInput, $enableEditModeLiSpan);
        return $enableEditModeLi.append($enableEditModeLiLabel);

    }

    formBuilder.prototype.bindAssignCheckBoxLi = function () {
        var context = this;

        var $assignBoxLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $assignBoxLiLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $assignBoxLiInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('assignCheckBox')
        });

        var $assignBoxLiSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_ASSIGN')).attr("for", context.getId('assignCheckBox'));

        $assignBoxLiLabel.append($assignBoxLiInput, $assignBoxLiSpan);
        return $assignBoxLi.append($assignBoxLiLabel);

    }

    formBuilder.prototype.bindScannerCheckBoxLi = function () {
        var context = this;

        var $scannerBoxLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p',
            id: context.getId('scannerLi')
        });

        var $scannerBoxLiLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $scannerBoxLiInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('scannerCheckBox')
        });

        var $scannerBoxLiSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_SCANNER')).attr("for", context.getId('scannerCheckBox'));

        $scannerBoxLiLabel.append($scannerBoxLiInput, $scannerBoxLiSpan);
        return $scannerBoxLi.append($scannerBoxLiLabel);
    }

    formBuilder.prototype.bindShowInPopUpLi = function () {
        var context = this;

        var $popupLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $popupLiLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $popupLiInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('showInPopup')
        });

        var $popupLiSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_SHOW_IN_POPUP')).attr("for", context.getId('showInPopup'));

        $popupLiLabel.append($popupLiInput, $popupLiSpan);
        return $popupLi.append($popupLiLabel);

    }


    formBuilder.prototype.bindPropertyReadonly = function () {
        var context = this;

        var $hiddenLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $hiddenLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $hiddenInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('readonly')
        });

        var $hiddenSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_READONLY')).attr("for", context.getId('readonly'));

        $hiddenLabel.append($hiddenInput, $hiddenSpan);
        return $hiddenLi.append($hiddenLabel);
    }

    formBuilder.prototype.bindPropertyHidden = function () {
        var context = this;

        var $hiddenLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $hiddenLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $hiddenInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('hidden')
        });

        var $hiddenSpan = $('<label>').addClass("lib-form-check-box-label ml-2").text(_common.getLocalizedValue('LBL_HIDDEN')).attr("for", context.getId('hidden'));

        $hiddenLabel.append($hiddenInput, $hiddenSpan);
        return $hiddenLi.append($hiddenLabel);
    }

    formBuilder.prototype.bindPropertyAssign = function () {
        var context = this;

        var $assignLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $assignLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $assignInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('assign')
        });

        var $assignSpan = $('<label>').addClass('lib-form-check-box-label ml-2').text(_common.getLocalizedValue('LBL_ASSIGN')).attr("for", context.getId('assign'));

        $assignLabel.append($assignInput, $assignSpan);
        return $assignLi.append($assignLabel);
    }



    formBuilder.prototype.bindPropertyConfirmation = function () {
        var context = this;

        var $confirmationLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $confirmationLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $confirmationInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('confirmation')
        });

        var $confirmationSpan = $('<label>').addClass('lib-form-check-box-label ml-2').text(_common.getLocalizedValue('LBL_CONFIRMATION')).attr("for", context.getId('confirmation'));

        $confirmationLabel.append($confirmationInput, $confirmationSpan);
        return $confirmationLi.append($confirmationLabel);
    }
    formBuilder.prototype.bindPropertyComment = function () {
        var context = this;

        var $commentLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $commentLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $commentInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('comment')
        });

        var $commentSpan = $('<label>').addClass('lib-form-check-box-label ml-2').text(_common.getLocalizedValue('LBL_COMMENT')).attr("for", context.getId('comment'));

        $commentLabel.append($commentInput, $commentSpan);
        return $commentLi.append($commentLabel);
    }
    formBuilder.prototype.bindNotificationPermission = function () {
        var context = this;

        var $notificationPermissionLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        }).append($('<label>', {
            class: 'lib-form-label',
            text: _common.getLocalizedValue('Notification')
        }));

        var $notificationPermissionLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $notificationPermissionInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('conditionnotificationPermission')
        });

        var $notificationPermissionSpan = $('<label>').addClass('lib-form-check-box-label ml-2').text('Email').attr("for", context.getId('conditionnotificationPermission'));
        var $pushnotificationPermissionInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('pushnotificationPermission'),
            style: 'margin-left: 15px;'
        });

        var $pushnotificationPermissionSpan = $('<label>').addClass('lib-form-check-box-label ml-2').text('Push').attr("for", context.getId('pushnotificationPermission'));

        $notificationPermissionLabel.append($notificationPermissionInput, $notificationPermissionSpan, $pushnotificationPermissionInput, $pushnotificationPermissionSpan);
        return $notificationPermissionLi.append($notificationPermissionLabel);
    }

    formBuilder.prototype.bindCheckpointPermission = function () {
        var context = this;

        var $checkpointPermissionLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $checkpointPermissionLabel = $('<div>', {
            class: 'lib-form-check-box lib-form-switch'
        });

        var $checkpointPermissionInput = $('<input>', {
            type: 'checkbox',
            class: 'lib-form-check-box-input',
            role: 'switch',
            id: context.getId('conditionAcceptedPermission')
        });

        var $checkpointPermissionSpan = $('<label>').addClass('lib-form-check-box-label ml-2').text(_common.getLocalizedValue('LBL_ALL_CONDITION_SHOULD_BE_ACCEPTED')).attr("for", context.getId('conditionAcceptedPermission'));

        $checkpointPermissionLabel.append($checkpointPermissionInput, $checkpointPermissionSpan);
        return $checkpointPermissionLi.append($checkpointPermissionLabel);
    }

    formBuilder.prototype.bindLovDropDownInCheckpoint = function () {
        var context = this;

        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_LOV'));

        var $divIntState = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative',
        });

        $('<select>', {
            id: context.getId('ddlSelectLovCheckpoint'),
            class: 'lib-form-control'
        }).appendTo($divIntState);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon',
            type: "button",
            id: context.getId('addLovFromCheckpoint')
        }).append($('<i>', {
            class: "fa fa-plus",
        })).appendTo($divIntState);

        return $labelLi.append($label, $divIntState);
    };

    formBuilder.prototype.bindLovDropDownInEvaluation = function () {
        var context = this;

        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_LOV'));

        var $divIntState = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative',
        });

        $('<select>', {
            id: context.getId('ddlSelectLovEvaluation'),
            class: 'lib-form-control'
        }).appendTo($divIntState);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon',
            type: "button",
            id: context.getId('addLovFromEvaluation')
        }).append($('<i>', {
            class: "fa fa-plus",
        })).appendTo($divIntState);

        return $labelLi.append($label, $divIntState);
    };

    formBuilder.prototype.bindLovDropDownInRadio = function () {
        var context = this;

        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_LOV'));

        var $divIntState = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative',
        });

        $('<select>', {
            id: context.getId('ddlSelectLov'),
            class: 'lib-form-control'
        }).appendTo($divIntState);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon',
            type: "button",
            id: context.getId('addLovFromRadio')
        }).append($('<i>', {
            class: "fa fa-plus",
        })).appendTo($divIntState);

        return $labelLi.append($label, $divIntState);
    };

    formBuilder.prototype.bindLovDropDownInCheckBox = function () {
        var context = this;

        var $labelLi = $('<li>', {
            class: 'lib-form-group no-change-class lib-prop-p'
        });

        var $label = $('<label>', {
            class: 'lib-form-label mandatory-star-red-after',
            'data-tkey': context.getUUID()
        }).text(_common.getLocalizedValue('LBL_LOV'));

        var $divIntState = $('<div>', {
            class: 'lib-input-group lib-add-btn-include lib-position-relative',
        });

        $('<select>', {
            id: context.getId('ddlSelectLovCheckbox'),
            class: 'lib-form-control'
        }).appendTo($divIntState);

        $('<button>', {
            class: 'lib-input-btn-custom add-btn-circle-icon',
            type: "button",
            id: context.getId('addLovFromCheckbox')
        }).append($('<i>', {
            class: "fa fa-plus",
        })).appendTo($divIntState);

        return $labelLi.append($label, $divIntState);
    };

    formBuilder.prototype.bindActiveDefn = function (eVal, context) {
        $("#" + context.getId('ulDefinition')).find('.repeat-row').removeClass('lib-active');
        $(eVal).addClass('lib-active');
        if ($("#" + context.getId('primaryKeyId')).prop("checked")) {
            $('#' + context.getId("checkBoxId")).prop("checked", true);
            $('#' + context.getId("checkBoxId")).prop("disabled", true);
        }
        if ($("#" + context.getId('primaryKeyPartition')).prop("checked")) {
            $('#' + context.getId("checkBoxId")).prop("checked", true);
            $('#' + context.getId("checkBoxId")).prop("disabled", true);
        }
        if ($("#" + context.getId('uniqueKeyId')).prop("checked")) {
            $('#' + context.getId("checkBoxId")).prop("checked", true);
            $('#' + context.getId("checkBoxId")).prop("disabled", true);
        }
        if ($("#" + context.getId('hidden')).prop("checked")) {
            $('#' + context.getId("checkBoxId")).prop("checked", false);
            $('#' + context.getId("primaryKeyId")).prop("checked", false);
            $('#' + context.getId("uniqueKeyId")).prop("checked", false);
            $('#' + context.getId("checkBoxId")).prop("disabled", true);
            $('#' + context.getId("primaryKeyId")).prop("disabled", true);
            $('#' + context.getId("uniqueKeyId")).prop("disabled", true);
        }
    }

    formBuilder.prototype.formAttributeClick = function () {
        var context = this;
        $("#" + context.getId('ulDefinition')).find(".lib-active").off("click").on("click", function () {
            const index = $(this).data('id');
            const item = context.definitionList.find(function (item) {
                return item.subType === 'form' && item.id === index;
            });
            if (item) {
                context.bindTemplateForm();
            }
        });
    }

    formBuilder.prototype.reportLabelBind = function () {
        var context = this;
        $("#" + context.getId("checklabelId")).focusout(function () {
            var labelVal = $("#" + context.getId("checklabelId")).val()
            var reportLabelVal = labelVal.substring(0, 30).trim();
            $("#" + context.getId("checkReportLabelId")).val(reportLabelVal);
        });
    }

    formBuilder.prototype.dataSourceTrigger = function () {
        var context = this;
        $("#" + context.getId('radioBtnDiv')).find('input[name="lovDataSource"]').on('change', function () {
            var def = context.getComponent(context.componentId);
            if (context.onChangeDropdownProperties(def)) {
                $("#" + context.getId('radioBtnDiv')).find('input[name="lovDataSource"]').filter('[value="' + def.configProperties?.dataSourceType + '"]').prop('checked', true);
                return false;
            } else {
                if ($(this).val() === 'LOV') {
                    $("#" + context.getId("lovDiv")).show();
                    $("#" + context.getId("serviceDiv")).hide();
                    $("#" + context.getId("formDropdownDiv")).hide();
                    $("#" + context.getId("scannerLi")).hide();
                    $("#" + context.getId("enableRangeFilterLi")).hide();
                    $("#" + context.getId("rangeColumnLi")).hide();
                    $("#" + context.getId("primaryKeyPartitionLi")).addClass('lib-hide');
                    $("#" + context.getId("multiSelectLi")).show();
                    $("#" + context.getId("multiselectId")).prop('checked', false);
                    $("#" + context.getId("additionalConditionColumnLi")).hide();
                    $("#" + context.getId("primaryKeyPartition")).prop('checked', false);
                } else if ($(this).val() === 'FORM') {
                    $("#" + context.getId("multiselectId")).prop('checked', false);
                    $("#" + context.getId("formDropdownDiv")).show();
                    $("#" + context.getId("serviceDiv")).hide();
                    $("#" + context.getId("scannerLi")).show();
                    $("#" + context.getId("lovDiv")).hide();
                    $("#" + context.getId("additionalConditionColumnLi")).show();
                    $("#" + context.getId("enableRangeFilterLi")).show();
                    if (def.configProperties?.enableRangeFilter) {
                        $("#" + context.getId("rangeColumnLi")).show();
                    }
                    $("#" + context.getId("primaryKeyPartitionLi")).removeClass('lib-hide');
                    if ($("#" + context.getId("formDropdown")).val() == 'MATERIAL') {
                        $("#" + context.getId("multiselectId")).prop('checked', false);
                        $("#" + context.getId("multiSelectLi")).hide();
                    } else {
                        $("#" + context.getId("multiSelectLi")).show();
                    }
                }
            }
        });
    }

    formBuilder.prototype.addInitialState = function () {
        var context = this;
        $("#" + context.getId('addIntState')).unbind('click').click(function () {
            context.modal(0);
            context.openFullScreenPopupModal();
            context.getStatusList();
        });
    }

    formBuilder.prototype.addNextState = function () {
        var context = this;
        $("#" + context.getId('addNextState')).unbind('click').click(function () {
            context.modal(0);
            context.openFullScreenPopupModal();
            context.getStatusList();
        });
    }

    formBuilder.prototype.addTemplate = function () {
        var context = this;
        $("#" + context.getId('addNewTemplateBtn')).unbind('click').click(function () {
            context.bindTemplateForm();
        });
    }

    formBuilder.prototype.bindUserGroups = function () {
        var context = this;
        var objMultiSelect = new multiSelect(context.getId('userGroupList'));
        objMultiSelect.setDataList(context.userGroupMultiSelectData(context.selectedUserGroup));
        objMultiSelect.bind();
        context.objects.userGroupMultiSelect = objMultiSelect;
    }
    formBuilder.prototype.bindEmailGroups = function () {
        var context = this;
        var objMultiSelect = new multiSelect(context.getId('emailGroupList'));
        objMultiSelect.setDataList(context.userGroupMultiSelectData(context.selectEmailGroup));
        objMultiSelect.bind();
        context.objects.emailGroupMultiSelect = objMultiSelect;
    }

    formBuilder.prototype.userGroupMultiSelectData = function (selectedUserGroup) {
        var context = this;
        return context.userGroupData.map(function (group) {
            return {
                key: group.groupId,
                value: group.groupName,
                __selected: selectedUserGroup.includes(group.groupId)
            };
        });
    }

    formBuilder.prototype.bindFormUserGroups = function () {
        var context = this;
        var objMultiSelect = new multiSelect(context.getId('formUserGroupList'));
        objMultiSelect.setDataList(context.formUserGroupMultiSelectData(context.selectedUserGroupForm));
        objMultiSelect.bind();
        context.objects.userGroupMultiSelectForm = objMultiSelect;
    }

    formBuilder.prototype.formUserGroupMultiSelectData = function (selectedUserGroup) {
        var context = this;
        return context.userGroupData.map(function (group) {
            return {
                key: group.groupId,
                value: group.groupName,
                __selected: selectedUserGroup.includes(group.groupId)
            };
        });
    }

    formBuilder.prototype.bindStages = function () {
        var context = this;
        var objMultiSelect = new multiSelect(context.getId('ddlStage'));
        objMultiSelect.setDataList(context.bindStagesMultiSelectData(context.selectedStages));
        objMultiSelect.setCallbacks({ dragCallback: function () { context.savePropertyData() } })
        objMultiSelect.bind();
        context.objects.stagesMultiSelect = objMultiSelect;
    }

    formBuilder.prototype.bindStagesMultiSelectData = function (selectedStages) {
        var context = this;
        var finalStatusList = [];

        finalStatusList = context.statusList.slice();

        finalStatusList.unshift({ id: "", statusName: "" });

        return finalStatusList.map(function (status) {
            return {
                key: status.id,
                value: status.statusName,
                __selected: selectedStages.includes(status.id)
            };
        });
    };



    formBuilder.prototype.bindDataStatus = function () {
        var context = this;
        $("#" + context.getId('ddlInitialState')).empty();
        var objMultiSelect = new multiSelect(context.getId('ddlInitialState'));
        objMultiSelect.setDataList(context.bindDataStatusMultiSelectData(context.selectedDataStatus));
        objMultiSelect.bind();
        context.objects.dataStatusMultiSelect = objMultiSelect;
    }

    formBuilder.prototype.bindDataStatusMultiSelectData = function (selectedDataStatus) {
        var context = this;
        var finalStatusList = [];

        finalStatusList = context.statusList.slice();

        finalStatusList.unshift({ id: "", statusName: "" });

        return finalStatusList.map(function (status) {
            return {
                key: status.id,
                value: status.statusName,
                __selected: selectedDataStatus.includes(status.id)
            };
        });
    };

    formBuilder.prototype.bindFieldLevelPermission = function () {
        var context = this;
        var objMultiSelect = new multiSelect(context.getId('fieldLabelPermission'));
        objMultiSelect.setDataList(context.bindFieldLevelPermissionMultiSelectData(context.selectedFieldLevelPermission));
        objMultiSelect.bind();
        context.objects.fieldLevelPermissionMultiSelect = objMultiSelect;
    }

    formBuilder.prototype.bindFieldLevelPermissionMultiSelectData = function (fieldLevelPermission) {
        var context = this;
        var dataList = [];
        for (var i = 0; i < context.definitionList.length; i++) {
            var definition = context.definitionList[i];
            if (definition.subType != 'action' && definition.subType != 'heading' && definition.subType != 'contextLabel') {
                var data = {
                    key: definition.id,
                    value: definition.label,
                    __selected: context.selectedFieldLevelPermission.includes(definition.id)
                };
                dataList.push(data);
            }
        }
        return dataList;
    };

    formBuilder.prototype.savePropertyData = function () {
        var context = this;
        var currentComponent = context.getComponent(context.componentId);
        if (currentComponent.subType == "text") {
            context.saveTextPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "textArea") {
            context.saveTextAreaPropertiesData(currentComponent);
        } else if (currentComponent.subType == "divider") {
            context.saveDividerPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "autoPopulated") {
            context.saveFieldPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "heading") {
            context.saveHeadingPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "evaluationresult") {
            context.saveEvaluationResultPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "autonumber") {
            context.saveAutoNumberPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "calculatedfields") {
            context.saveCalculatedFieldPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "transaction") {
            context.saveTransactionPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "rdi") {
            context.saveRelationalDataInputPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "additionalinfo") {
            context.saveAdditionalInfoPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "formTitle") {
            context.saveFormTitlePropertiesData(currentComponent);
        }

        else if (currentComponent.subType == "number") {
            context.saveNumberPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "decimal") {
            context.saveDecimalPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "date") {
            context.saveSelectDatePropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "dateTime") {
            context.saveSelectDateAndTimePropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "select") {
            context.saveDropDownPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "file") {
            context.saveFileUploadPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "action") {
            context.saveActionPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "radio") {
            context.saveRadioPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "checkbox") {
            context.saveCheckboxPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "comment") {
            context.saveCommentPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "mm") {
            context.saveMMNumberPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "checkpoint") {
            context.saveCheckpointPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "form") {
            context.saveFormPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "grid") {
            context.saveGridPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "scanner") {
            context.saveScannerPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "scancode") {
            context.saveScanCodePropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "label") {
            context.saveLabelPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "coordinate") {
            context.saveCoordinatePropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "template") {
            context.saveTemplatePropertiesData(currentComponent);
        }

        else if (currentComponent.subType == "table") {
            context.saveTablePropertyData(currentComponent);
        }
        else if (currentComponent.subType == "actionForm") {
            context.saveActionFormPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "contextLabel") {
            context.saveContextLabelPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "matrix") {
            context.saveMatrixPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "location") {
            context.saveLocationPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "signatory") {
            context.saveSignatoryPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "user") {
            context.saveUserPropertiesData(currentComponent);
        }
        else if (currentComponent.subType == "evaluation") {
            context.saveEvaluationPropertiesData(currentComponent);
        }

        context.textNumberDecimalHiddenProp(currentComponent);
        context.bindContextPassingAttr();
    }

    formBuilder.prototype.bindContextPassingAttr = function () {

    }

    formBuilder.prototype.textNumberDecimalHiddenProp = function (currentComponent) {
        var context = this;
        if (currentComponent.subType == "text") {
            if (currentComponent.configProperties?.hidden) {
                $("#" + context.getId(currentComponent.id)).addClass('hiddenActive')
            } else {
                $("#" + context.getId(currentComponent.id)).removeClass('hiddenActive')
            }
        }
        else if (currentComponent.subType == "number") {
            if (currentComponent.configProperties?.hidden) {
                $("#" + context.getId(currentComponent.id)).addClass('hiddenActive')
            } else {
                $("#" + context.getId(currentComponent.id)).removeClass('hiddenActive')
            }
        }
        else if (currentComponent.subType == "decimal") {
            if (currentComponent.configProperties?.hidden) {
                $("#" + context.getId(currentComponent.id)).addClass('hiddenActive')
            } else {
                $("#" + context.getId(currentComponent.id)).removeClass('hiddenActive')
            }
        }
    }

    formBuilder.prototype.saveTextPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();
        currentComponent.defaultValue = $("#" + context.getId("defaultValueId")).val().trim();
        currentComponent.regex = $("#" + context.getId("regexId")).val().trim();
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.configProperties.excludeFromMob = $("#" + context.getId("excludeFromMobId")).prop('checked');
        currentComponent.configProperties.hidden = $("#" + context.getId("hidden")).prop('checked');
        currentComponent.configProperties.readonly = $("#" + context.getId("readonly")).prop('checked');
        currentComponent.key = $("#" + context.getId("primaryKeyId")).prop('checked') ? "P" : "";
        currentComponent.configProperties.uniqueKey = $("#" + context.getId("uniqueKeyId")).prop('checked');
        currentComponent.configProperties.showInWeb = $("#" + context.getId("showInWebId")).prop('checked');
        currentComponent.configProperties.showInMob = $("#" + context.getId("showInMobId")).prop('checked');
        currentComponent.configProperties.copy = $("#" + context.getId("copyId")).prop('checked');
    }

    formBuilder.prototype.saveLabelPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val()?.trim();
        currentComponent.customId = $("#" + context.getId("customId")).val()?.trim();
        currentComponent.defaultValue = $("#" + context.getId("defaultValueId")).val()?.trim();
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.configProperties.excludeFromMob = $("#" + context.getId("excludeFromMobId")).prop('checked');
    }

    formBuilder.prototype.saveContextLabelPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.customId = $("#" + context.getId("customId")).val()?.trim();
        currentComponent.label = $("#" + context.getId("checklabelId")).val()?.trim();
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.configProperties.excludeFromMob = $("#" + context.getId("excludeFromMobId")).prop('checked');
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
    }

    formBuilder.prototype.saveCoordinatePropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val()?.trim();
        currentComponent.customId = $("#" + context.getId("customId")).val()?.trim();
        currentComponent.configProperties.spatialWidth = $("#" + context.getId("spatialWidthInput")).val()?.trim();
        currentComponent.configProperties.spatialColor = $("#" + context.getId("spatialColorInput")).val()?.trim();
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        var coordinateType = $("#" + context.getId('radioBtnDiv')).find('input[name="coordinate"]:checked').val();
        if (coordinateType === 'LINE') {
            currentComponent.configProperties.spatialStyle = $("#" + context.getId("lineStyleSelect")).val()?.trim();
        } else if (coordinateType === 'POINT') {
            currentComponent.configProperties.spatialStyle = $("#" + context.getId("spatialStyleInput")).val()?.trim();
        }
        currentComponent.configProperties.coordinateType = coordinateType;
    };


    formBuilder.prototype.saveTemplatePropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val()?.trim();
        currentComponent.customId = $("#" + context.getId("customId")).val()?.trim();
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.configProperties.excludeFromMob = $("#" + context.getId("excludeFromMobId")).prop('checked');
        currentComponent.configProperties.templateModule = $("#" + context.getId("templateModule")).val()?.trim();
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.showInWeb = $("#" + context.getId("showInTemplateWebId")).prop('checked');

    }

    formBuilder.prototype.saveTablePropertyData = function () {
        var context = this;
        var columns = [];
        var rows = [];
        var currentComponent = context.getComponent(context.componentId);
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        $(".new-column-class").each(function () {
            if (($("#col_" + $(this).attr("data-id")).val()).trim() != "") {
                var column = {};
                column.id = $(this).attr("data-id");
                column.label = $("#col_" + $(this).attr("data-id")).val().trim();
                columns.push(column);
            }
        });
        $(".new-row-class").each(function () {
            if (($("#row_" + $(this).attr("data-id")).val()).trim() != "") {
                var row = {};
                row.id = $(this).attr("data-id");
                row.label = $("#row_" + $(this).attr("data-id")).val().trim();
                rows.push(row);
            }
        });
        currentComponent.configProperties.columns = columns;
        currentComponent.configProperties.rows = rows;
    }

    formBuilder.prototype.saveTextAreaPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();
        currentComponent.regex = $("#" + context.getId("regexId")).val().trim();
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.configProperties.excludeFromMob = $("#" + context.getId("excludeFromMobId")).prop('checked');
        currentComponent.configProperties.showInMob = $("#" + context.getId("showInMobId")).prop('checked');
        currentComponent.configProperties.showInWeb = $("#" + context.getId("showInWebId")).prop('checked');
        currentComponent.configProperties.copy = $("#" + context.getId("copyId")).prop('checked');
    }

    formBuilder.prototype.saveDividerPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();

    }

    formBuilder.prototype.saveMatrixPropertiesData = function (currentComponent) {
        var context = this;
        var currentComponent = context.getComponent(context.componentId);
        var matrixCondition = [];
        var selectedTemplate = {};
        selectedTemplate.id = $("#" + context.getId("matrixTemplateList")).find(":selected").val();
        selectedTemplate.templateId = $("#" + context.getId("matrixTemplateList")).find(":selected")?.attr("data-templateId");
        selectedTemplate.defId = $("#" + context.getId("matrixTemplateList")).find(":selected")?.attr("data-defId");
        currentComponent.configProperties.selectedMatrixForms = context.objects["matrixForms"].getMultiSelectedValuesJList().join(',');
        currentComponent.configProperties.selectedMatrixColumns = context.objects["matrixColumns"]?.getMultiSelectedValuesJList();
        currentComponent.configProperties.selectedTemplate = selectedTemplate;
        currentComponent.configProperties.matrixCondition = context.extractMatrixConditions(context);
    }

    formBuilder.prototype.extractMatrixConditions = function (context) {
        var matrixCondition = [];

        $("#" + context.getId("conditionColumns")).find('li').each(function () {
            var condition = {};
            var firstSelectId = $(this).find('.first-condition').attr("id");
            var secondSelectId = $(this).find('.second-condition').attr("id");

            if (firstSelectId) {
                condition.firstCondition = context.extractConditionData(firstSelectId);
            }
            if (secondSelectId) {
                condition.secondCondition = context.extractConditionData(secondSelectId);
            }

            matrixCondition.push(condition);
        });

        return matrixCondition;
    };

    formBuilder.prototype.extractConditionData = function (selectId) {
        var $select = $("#" + selectId).find(":selected");
        var data = {
            id: $select.val(),
            type: $select.attr("data-type"),
            templateId: $select.attr("data-templateId")
        };
        data.selectedAttrFormId = data.type === "FORM" ? $select.attr("data-selectedAttrFormId") : "";
        data.attrId = data.type === "FORM" ? $select.attr("data-attrId") : "";
        return data;
    };

    formBuilder.prototype.saveFieldPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.configProperties.attributeId = $("#" + context.getId("autoPopulatedDef")).find(":selected").val();
        currentComponent.configProperties.template_id = $("#" + context.getId("autoPopulatedDef")).find(":selected").attr("data-templateId");
        currentComponent.configProperties.tableName = $("#" + context.getId("autoPopulatedDef")).find(":selected").attr("tableName");
        if (currentComponent.configProperties.tableName != 'MATERIAL' || !currentComponent.configProperties.template_id) {
            currentComponent.configProperties.selectedAttributesList = context.objects?.selectedAttributesList?.getSelectedValues();
        } else {
            currentComponent.configProperties.selectedAttributesList = [];
        }
    }

    formBuilder.prototype.saveGridPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.configProperties.popupLable = $("#" + context.getId("popupLableId")).val().trim();
        currentComponent.configProperties.eventLabel = $("#" + context.getId("eventLabel")).val().trim();
        currentComponent.configProperties.eventMessage = $("#" + context.getId("eventMessage")).val().trim();
        currentComponent.configProperties.eventId = $("#" + context.getId("eventId")).val().trim();
        currentComponent.configProperties.template_id = $("#" + context.getId("gridTemplateList")).find(":selected").val();
        currentComponent.configProperties.selectedGridAttributeList = context.objects?.selectedGridAttributeList?.getSelectedValues();
        currentComponent.configProperties.redirectForm = $("#" + context.getId("gridRedirectForm")).find(":selected").val();
        currentComponent.configProperties.parentTemplateId = $("#" + context.getId("parentGridTemplateList")).find(":selected").val();
        currentComponent.configProperties.showInPopup = $("#" + context.getId("showInPopup")).prop('checked');
        currentComponent.configProperties.enableEditMode = $("#" + context.getId("enableEditMode")).prop('checked');
        currentComponent.configProperties.assignCheckBox = $("#" + context.getId("assignCheckBox")).prop('checked');
        currentComponent.configProperties.scanner = $("#" + context.getId("scannerCheckBox")).prop('checked');
    }

    formBuilder.prototype.saveHeadingPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();
        currentComponent.configProperties.style = $("#" + context.getId("ddlheading")).val()?.trim();
        currentComponent.configProperties.align = $("#" + context.getId("ddlalign")).val()?.trim();
        currentComponent.configProperties.divider = $("#" + context.getId("headingDivider")).prop('checked');
    }

    formBuilder.prototype.extractEvaluationConditions = function (context) {
        var evaluationConditions = [];
        $("#" + context.getId("evaluationResultConditions")).find('li').each(function () {
            var condition = {};
            var dataInput = $(this).find('input').eq(0).val().trim();
            var resultInput = $(this).find('input').eq(1).val().trim();
            var colourInput = $(this).find('input[type="color"]').val().trim();

            var numericData = parseFloat(dataInput);

            condition.score = (dataInput === "") ? "" : numericData.toString();
            condition.result = typeof resultInput === 'string' ? resultInput : '';
            condition.colour = colourInput || '#000000';

            evaluationConditions.push(condition);
        });

        return evaluationConditions;
    };

    formBuilder.prototype.saveEvaluationResultPropertiesData = function (currentComponent) {
        var context = this;
        var currentComponent = context.getComponent(context.componentId);
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.configProperties.evaluationConditions = context.extractEvaluationConditions(context);
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.showInWeb = $("#" + context.getId("showInWebId")).prop('checked');
    };



    formBuilder.prototype.saveAutoNumberPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();
        currentComponent.configProperties.paddingLength = $("#" + context.getId("paddingLengthId")).val().trim();
        currentComponent.configProperties.prefix = $("#" + context.getId("prefixId")).val().trim();
        currentComponent.configProperties.postfix = $("#" + context.getId("postfixId")).val().trim();
        currentComponent.configProperties.preview = $("#" + context.getId("previewId")).val().trim();
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.key = $("#" + context.getId("primaryKeyId")).prop('checked') ? "P" : "";
        currentComponent.configProperties.showInWeb = $("#" + context.getId("showInWebId")).prop('checked');
        currentComponent.configProperties.showInMob = $("#" + context.getId("showInMobId")).prop('checked');
    }

    formBuilder.prototype.saveCalculatedFieldPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();
        currentComponent.constraint = "";
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.readonly = true;
        currentComponent.configProperties.showInWeb = $("#" + context.getId("showInWebId")).prop('checked');
        currentComponent.configProperties.showInMob = $("#" + context.getId("showInMobId")).prop('checked');
        currentComponent.configProperties.copy = $("#" + context.getId("copyId")).prop('checked');
        currentComponent.configProperties.dataSourceType = currentComponent.configProperties.dataSourceType ? currentComponent.configProperties.dataSourceType : "NUMBER";
        var selectedId = currentComponent.configProperties.dataSourceType === 'NUMBER' ? 'selectNumberFields' : 'selectStringFields';
        var fieldMap = context.createFieldMapping(selectedId);
        if (currentComponent.configProperties.dataSourceType ? currentComponent.configProperties.dataSourceType === "NUMBER" : $("#" + context.getId('calculatedRadioBtnDiv')).find('input[name="calculatedDataSource"]:checked').val() === 'NUMBER') {
            currentComponent.configProperties.dataSourceType = "NUMBER";
            currentComponent.configProperties.expression = currentComponent.configProperties.expression ? currentComponent.configProperties.expression : '';
            currentComponent.configProperties.expressionArr = $("#" + context.getId("formulaNumberDisplay")).attr("exp_attr") ? JSON.parse($("#" + context.getId("formulaNumberDisplay")).attr("exp_attr")) : [];
        }
        else if (currentComponent.configProperties.dataSourceType ? currentComponent.configProperties.dataSourceType === "STRING" : $("#" + context.getId('calculatedRadioBtnDiv')).find('input[name="calculatedDataSource"]:checked').val() === 'STRING') {
            currentComponent.configProperties.dataSourceType = "STRING";
            currentComponent.configProperties.expression = currentComponent.configProperties.expression ? currentComponent.configProperties.expression : '';
            currentComponent.configProperties.expressionArr = $("#" + context.getId("formulaStringDisplay")).attr("exp_attr") ? JSON.parse($("#" + context.getId("formulaStringDisplay")).attr("exp_attr")) : [];
        }
        else if (currentComponent.configProperties.dataSourceType ? currentComponent.configProperties.dataSourceType === "DISTANCE" : $("#" + context.getId('calculatedRadioBtnDiv')).find('input[name="calculatedDataSource"]:checked').val() === 'DISTANCE') {
            currentComponent.configProperties.dataSourceType = "DISTANCE";
            currentComponent.configProperties.fromAttribute = $("#" + context.getId("selectFormDistance")).find(":selected").val();
            currentComponent.configProperties.toAttribute = $("#" + context.getId("selectToDistance")).find(":selected").val();
            currentComponent.configProperties.measurementUnit = $("#" + context.getId("selectMeasurementUnit")).find(":selected").val();
            currentComponent.configProperties.dimensionLength = $("#" + context.getId('lengthDimension')).find('input[name="lengthDimension"]:checked').val();
        }
        currentComponent.configProperties.usedColumns = currentComponent.configProperties.expressionArr ? [...new Set(currentComponent.configProperties.expressionArr.filter(item => item.trim() in fieldMap))] : [];
    }

    formBuilder.prototype.saveSignatoryPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
    }

    formBuilder.prototype.saveTransactionPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.configProperties.transactionType = $("#" + context.getId('transactionBtnDiv')).find('input[name="transaction"]:checked').val();
    }

    formBuilder.prototype.saveRelationalDataInputPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();
        currentComponent.configProperties.sidesLabel = $("#" + context.getId("dropdownBox_sidesLabel")).val();
        currentComponent.configProperties.rdiRule = $("#" + context.getId("dropdownBox_rdiRule")).val();
        currentComponent.configProperties.rdiAssignment = $("#" + context.getId("dropdownBox_rdiAssignment")).val();
        currentComponent.configProperties.rdiAssignee = $("#" + context.getId("dropdownBox_rdiAssignee")).val();
        currentComponent.configProperties.rdiRuleAndAssignment = $("#" + context.getId("dropdownBox_rdiRuleAndAssignment")).val();
        currentComponent.configProperties.rdiQualification = $("#" + context.getId("dropdownBox_rdiQualification")).val();
        currentComponent.configProperties.noOfSidesAttr = $("#" + context.getId("dropdownBox_rdiNoOfSides")).val();
        currentComponent.configProperties.rdiNoOfAssignee = $("#" + context.getId("dropdownBox_rdiNoOfAssignee")).find(":selected").attr("template_id");
        var noOfAssigneeValue = $("#" + context.getId("dropdownBox_rdiNoOfAssignee")).val();
        currentComponent.configProperties.noOfAssigneeAttr = noOfAssigneeValue?.split('_')[1];
    }

    formBuilder.prototype.saveAdditionalInfoPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.configProperties.created_by = $("#" + context.getId("created_by")).prop('checked');
        $("#" + context.getId("created_by_text")).val() ? currentComponent.configProperties.createdByLabel = $("#" + context.getId("created_by_text")).val() : currentComponent.configProperties.createdByLabel = "created_by";
        currentComponent.configProperties.created_dt = $("#" + context.getId("created_date")).prop('checked');
        $("#" + context.getId("created_date_text")).val() ? currentComponent.configProperties.createdDateLabel = $("#" + context.getId("created_date_text")).val() : currentComponent.configProperties.createdDateLabel = "created_dt";
        currentComponent.configProperties.latest_status = $("#" + context.getId("latest_status")).prop('checked');
        $("#" + context.getId("latest_status_text")).val() ? currentComponent.configProperties.latestStatusLabel = $("#" + context.getId("latest_status_text")).val() : currentComponent.configProperties.latestStatusLabel = "latest_status";
    }

    formBuilder.prototype.saveFormTitlePropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.configProperties.title = $("#" + context.getId("titleId")).val().trim();
        currentComponent.configProperties.leftTitle = $("#" + context.getId("leftInputTitleId_div")).find("span").text();
        currentComponent.configProperties.rightTitle = $("#" + context.getId("rightInputTitleId_div")).find("span").text();
    }

    formBuilder.prototype.saveNumberPropertiesData = function (currentComponent) {
        var context = this;
        var fieldMap = context.createFieldMapping('selectNumberFields');
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();
        currentComponent.defaultValue = $("#" + context.getId("defaultValueId")).val().trim();
        currentComponent.regex = $("#" + context.getId("regexId")).val().trim();
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.configProperties.excludeFromMob = $("#" + context.getId("excludeFromMobId")).prop('checked');
        currentComponent.configProperties.hidden = $("#" + context.getId("hidden")).prop('checked');
        currentComponent.configProperties.readonly = $("#" + context.getId("readonly")).prop('checked');
        currentComponent.key = $("#" + context.getId("primaryKeyId")).prop('checked') ? "P" : "";
        currentComponent.configProperties.cost = $("#" + context.getId("cost")).prop('checked');
        currentComponent.configProperties.length = $("#" + context.getId("length")).prop('checked');
        currentComponent.configProperties.uniqueKey = $("#" + context.getId("uniqueKeyId")).prop('checked');
        currentComponent.configProperties.showInWeb = $("#" + context.getId("showInWebId")).prop('checked');
        currentComponent.configProperties.showInMob = $("#" + context.getId("showInMobId")).prop('checked');
        currentComponent.configProperties.copy = $("#" + context.getId("copyId")).prop('checked');
        currentComponent.configProperties.expressionValidation = $("#" + context.getId("expressionId")).prop('checked');

        if (currentComponent.configProperties.expressionValidation) {
            currentComponent.configProperties.expressionArr = $("#" + context.getId("formulaNumberDisplay")).attr("exp_attr") ? JSON.parse($("#" + context.getId("formulaNumberDisplay")).attr("exp_attr")) : [];
            currentComponent.configProperties.expression = currentComponent.configProperties.expressionArr.length > 0 ? context.getModifiedExpression(currentComponent.configProperties.expressionArr.join(',')).split(" ").join(",") : "";
            $("#" + context.getId("expressionLabel")).text(currentComponent.configProperties.expression.split(',').map(a => fieldMap[a.trim()] || a.trim()).join(' '));
            currentComponent.configProperties.usedColumns = currentComponent.configProperties.expressionArr ? [...new Set(currentComponent.configProperties.expressionArr.filter(item => item.trim() in fieldMap))] : [];
            currentComponent.configProperties.errorMessage = $("#" + context.getId("errorInputField")).val().length > 0 ? $("#" + context.getId("errorInputField")).val().trim() : "";
        } else {
            currentComponent.configProperties.expression = "";
            currentComponent.configProperties.expressionArr = [];
            currentComponent.configProperties.usedColumns = [];
            currentComponent.configProperties.errorMessage = "";
            currentComponent.configProperties.expressionValidation = false;
        }
    }

    formBuilder.prototype.saveDecimalPropertiesData = function (currentComponent) {
        var context = this;
        var fieldMap = context.createFieldMapping('selectNumberFields');
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();
        currentComponent.defaultValue = $("#" + context.getId("defaultValueId")).val().trim();
        currentComponent.regex = $("#" + context.getId("regexId")).val().trim();
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.decimalPlaces = $("#" + context.getId("decimalPlacesId")).val().trim();
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.configProperties.excludeFromMob = $("#" + context.getId("excludeFromMobId")).prop('checked');
        currentComponent.key = $("#" + context.getId("primaryKeyId")).prop('checked') ? "P" : "";
        currentComponent.configProperties.hidden = $("#" + context.getId("hidden")).prop('checked');
        currentComponent.configProperties.readonly = $("#" + context.getId("readonly")).prop('checked');
        currentComponent.configProperties.cost = $("#" + context.getId("cost")).prop('checked');
        currentComponent.configProperties.length = $("#" + context.getId("length")).prop('checked');
        currentComponent.configProperties.uniqueKey = $("#" + context.getId("uniqueKeyId")).prop('checked');
        currentComponent.configProperties.showInWeb = $("#" + context.getId("showInWebId")).prop('checked');
        currentComponent.configProperties.showInMob = $("#" + context.getId("showInMobId")).prop('checked');
        currentComponent.configProperties.copy = $("#" + context.getId("copyId")).prop('checked');
        currentComponent.configProperties.expressionValidation = $("#" + context.getId("expressionId")).prop('checked');
        if (currentComponent.configProperties.expressionValidation) {
            currentComponent.configProperties.expressionArr = $("#" + context.getId("formulaNumberDisplay")).attr("exp_attr") ? JSON.parse($("#" + context.getId("formulaNumberDisplay")).attr("exp_attr")) : [];
            currentComponent.configProperties.expression = currentComponent.configProperties.expressionArr.length > 0 ? context.getModifiedExpression(currentComponent.configProperties.expressionArr.join(',')).split(" ").join(",") : "";
            $("#" + context.getId("expressionLabel")).text(currentComponent.configProperties.expression.split(',').map(a => fieldMap[a.trim()] || a.trim()).join(' '));
            currentComponent.configProperties.usedColumns = currentComponent.configProperties.expressionArr ? [...new Set(currentComponent.configProperties.expressionArr.filter(item => item.trim() in fieldMap))] : [];
            currentComponent.configProperties.errorMessage = $("#" + context.getId("errorInputField")).val().length > 0 ? $("#" + context.getId("errorInputField")).val().trim() : "";
        } else {
            currentComponent.configProperties.expression = "";
            currentComponent.configProperties.expressionArr = [];
            currentComponent.configProperties.usedColumns = [];
            currentComponent.configProperties.errorMessage = "";
            currentComponent.configProperties.expressionValidation = false;
        }
    }

    formBuilder.prototype.saveCheckpointPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.lovId = $("#" + context.getId("ddlSelectLovCheckpoint")).find(":selected").val();
    }

    formBuilder.prototype.saveFormPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.configProperties.popupLable = $("#" + context.getId("popupLableId")).val().trim();
        currentComponent.configProperties.buttonName = $("#" + context.getId("buttonId")).val().trim();
        currentComponent.configProperties.allowMultipleEntries = $("#" + context.getId("allowMultiple")).prop('checked');
        currentComponent.configProperties.template_id = $("#" + context.getId("templateList")).find(":selected").val();
        currentComponent.configProperties.isReferenceForm = $("#" + context.getId("externalId")).prop('checked');
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
    }

    formBuilder.prototype.saveScannerPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.autoGeneratedQr = $("#" + context.getId("autoGeneratedQrId")).prop('checked');
    }

    formBuilder.prototype.saveSelectDatePropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.configProperties.excludeFromMob = $("#" + context.getId("excludeFromMobId")).prop('checked');
        currentComponent.configProperties.currentDate = $("#" + context.getId("currentDateId")).prop('checked');
        currentComponent.configProperties.nonEditDate = $("#" + context.getId("nonEditDate")).prop('checked');
        currentComponent.configProperties.showInWeb = $("#" + context.getId("showInWebId")).prop('checked');
        currentComponent.configProperties.showInMob = $("#" + context.getId("showInMobId")).prop('checked');
        currentComponent.configProperties.copy = $("#" + context.getId("copyId")).prop('checked');
    }
    formBuilder.prototype.saveSelectDateAndTimePropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.configProperties.excludeFromMob = $("#" + context.getId("excludeFromMobId")).prop('checked');
        currentComponent.configProperties.currentDate = $("#" + context.getId("currentDateId")).prop('checked');
        currentComponent.configProperties.nonEditDate = $("#" + context.getId("nonEditDate")).prop('checked');
        currentComponent.configProperties.showInWeb = $("#" + context.getId("showInWebId")).prop('checked');
        currentComponent.configProperties.showInMob = $("#" + context.getId("showInMobId")).prop('checked');
        currentComponent.configProperties.copy = $("#" + context.getId("copyId")).prop('checked');
    }
    formBuilder.prototype.saveDropDownPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val()?.trim();
        currentComponent.customId = $("#" + context.getId("customId")).val()?.trim();
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.configProperties.excludeFromMob = $("#" + context.getId("excludeFromMobId")).prop('checked');
        currentComponent.configProperties.multiSelect = $("#" + context.getId("multiselectId")).prop('checked');
        currentComponent.configProperties.uniqueKey = $("#" + context.getId("uniqueKeyId")).prop('checked');
        currentComponent.configProperties.dataSourceType = $("#" + context.getId('radioBtnDiv')).find('input[name="lovDataSource"]:checked').val();
        currentComponent.configProperties.showInWeb = $("#" + context.getId("showInWebId")).prop('checked');
        currentComponent.configProperties.showInMob = $("#" + context.getId("showInMobId")).prop('checked');
        currentComponent.configProperties.copy = $("#" + context.getId("copyId")).prop('checked');
        currentComponent.configProperties.scanner = $("#" + context.getId("scannerCheckBox")).prop('checked');
        currentComponent.configProperties.primaryKeyPartition = $("#" + context.getId("primaryKeyPartition")).prop('checked');
        currentComponent.configProperties.uniqueKey = $("#" + context.getId("uniqueKeyId")).prop('checked');
        if ($("#" + context.getId('radioBtnDiv')).find('input[name="lovDataSource"]:checked').val() === 'LOV') {
            currentComponent.configProperties.lovId = $("#" + context.getId("ddlDropdownBox")).find(":selected").val();
        } else if ($("#" + context.getId('radioBtnDiv')).find('input[name="lovDataSource"]:checked').val() === 'FORM') {
            var type = $("#" + context.getId("formDropdown")).find('option:selected').data('type');
            if (type === "TEMPLATE") {
                currentComponent.configProperties.type = "TEMPLATE";
                currentComponent.configProperties.formId = $("#" + context.getId("formDropdown")).find(":selected").val();
                currentComponent.configProperties.featureId = "";
                currentComponent.configProperties.tableName = $("#" + context.getId("formDropdown")).find(":selected").attr("tableName");
                currentComponent.configProperties.formConditions = context.getFormConditionList();

            } else {
                currentComponent.configProperties.type = "FEATURE";
                currentComponent.configProperties.featureId = $("#" + context.getId("formDropdown")).find(":selected").val();
                currentComponent.configProperties.formId = "";
            }
            currentComponent.configProperties.enableRangeFilter = $("#" + context.getId("enableRangeFilter")).prop('checked');
            currentComponent.configProperties.existingDataTemplate = $("#" + context.getId("existingDataFormDropdown")).find(":selected").val();
            currentComponent.configProperties.existingDataAttrId = $("#" + context.getId("dataExistAttributeList")).find(":selected");
            currentComponent.configProperties.formAttribute = $("#" + context.getId('formAttributesList')).find(":selected").val();
            currentComponent.configProperties.formAttributeType = $("#" + context.getId('formAttributesList')).find(":selected").val() ? 'U' : 'P';
            currentComponent.configProperties.columnType = context.filter(context.templateList, { template_id: currentComponent.configProperties.formId })[0]?.feature_id || "";
            currentComponent.configProperties.existingDataTable = $("#" + context.getId("existingDataFormDropdown")).find(":selected").attr("data-tablename");
            currentComponent.configProperties.rangeConditionList = context.getRangeConditionList();
            currentComponent.configProperties.dataExistenceConditions = context.getAdditionalConditionList();
        }
        else {
            currentComponent.configProperties.selectedApi = $("#" + context.getId("selectApi")).val().trim();
            var data = context.filter(context.dropdownServiceUrl, { key: currentComponent?.configProperties?.selectedApi });
            currentComponent.configProperties.apiPath = data[0]?.api;
            currentComponent.configProperties.idCol = data[0]?.idCol;
            currentComponent.configProperties.displayCol = data[0]?.displayCol;
        }
    }

    formBuilder.prototype.getRangeConditionList = function () {
        var context = this;
        var rangeConditionList = [];
        var secondFormId = $("#" + context.getId("formDropdown")).find(":selected").val();
        $("#" + context.getId("rangeColumns")).find('li').each(function () {
            var additionalCond = {};

            var $select1 = $(this).find('.left-condition').find(":selected");
            var $select2 = $(this).find('.right-condition').find(":selected");
            var $select3 = $(this).find('.between-condition').find(":selected");

            additionalCond.firstFormId = "";
            additionalCond.secondFormId = secondFormId;
            additionalCond.attribute1Id = $select1.val();
            additionalCond.attribute1 = $select1.attr("data-attrid");
            additionalCond.attribute1ApId = $select1.attr("data-apid");
            additionalCond.operator = $(this).find('.operator-condition').val();
            additionalCond.attribute2Id = $select2.val();
            additionalCond.attribute2 = $select2.attr("data-attrid");
            additionalCond.attribute2ApId = $select2.attr("data-apid");
            if (additionalCond.operator === "BETWEEN") {
                additionalCond.attribute3Id = $select3.val();
                additionalCond.attribute3 = $select3.attr("data-attrid");
                additionalCond.attribute3ApId = $select3.attr("data-apid");
            }
            additionalCond.condition = $(this).find('.and-or-condition').find(":selected").val();
            rangeConditionList.push(additionalCond);
        });

        return rangeConditionList;


    }

    formBuilder.prototype.getAdditionalConditionList = function () {
        var context = this;
        var rangeConditionList = [];
        $("#" + context.getId("additionalConditionColumns")).find('li').each(function () {
            var additionalCond = {};
            var $dataExistenceForm = $(this).find('.existing-data-form').find(":selected");
            var $dataExistenceAttribute = $(this).find('.existing-data-attribute').find(":selected");

            var $select1 = $(this).find('.left-condition').find(":selected");
            var $select2 = $(this).find('.right-condition').find(":selected");
            var lovConditionList = [];
            var lovCondition = {};
            lovCondition["lovId"] = $select1.attr("lov-id");
            lovCondition["type"] = $select1.attr("def-type");
            lovCondition["lovAttrId"] = $select1.val();
            lovCondition["lovValueId"] = $select2.val();
            lovConditionList.push(lovCondition);
            additionalCond["dataExistingTable"] = $dataExistenceForm.attr('data-tablename');
            additionalCond["dataExistingTemplateId"] = $dataExistenceForm.val();
            additionalCond["dataExistingAttrId"] = $dataExistenceAttribute.val();
            additionalCond["lovConditionList"] = lovConditionList;
            additionalCond["condition"] = $(this).find('.and-or-condition').find(":selected").val();
            rangeConditionList.push(additionalCond);
        });
        return rangeConditionList;
    }

    formBuilder.prototype.getFormConditionList = function () {
        var context = this;
        var formConditionList = [];
        $("#" + context.getId("formConditionColumns")).find('li').each(function () {
            var additionalCond = {};
            var $select1 = $(this).find('.left-condition').find(":selected");
            var $select2 = $(this).find('.right-condition').find(":selected");
            additionalCond["lovId"] = $select1.attr("lov-id");
            additionalCond["type"] = $select1.attr("def-type");
            additionalCond["lovAttrId"] = $select1.val();
            additionalCond["lovValueId"] = $select2.val();
            additionalCond["condition"] = $(this).find('.and-or-condition').find(":selected").val();
            formConditionList.push(additionalCond);
        });
        return formConditionList;
    }

    formBuilder.prototype.saveFileUploadPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.imageOnly = $("#" + context.getId("imageOnlyId")).prop('checked');
    }

    formBuilder.prototype.saveActionPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.otherEmail = $("#" + context.getId("otherEmailId")).val().trim();
        currentComponent.actionProperties = context.setActionDataProperties(currentComponent);
    }

    formBuilder.prototype.saveActionFormPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.configProperties.userGroupList = context.objects?.userGroupMultiSelectForm?.getSelectedValues();
        currentComponent.configProperties.template_id = $("#" + context.getId("templateList")).find(":selected").val()
    }

    formBuilder.prototype.setActionDataProperties = function () {
        var context = this;
        var actionProperties = {
            template_id: $("#" + context.getId("templateList")).find(":selected").val(),
            businessEvent: ($("#" + context.getId("ddlBusinessEvent")).find(":selected").val() ? $("#" + context.getId("ddlBusinessEvent")).find(":selected").val() : "").trim(),
            dataStatus: context.objects.dataStatusMultiSelect.getSelectedValues(),
            stages: context.objects.stagesMultiSelect.getSelectedValues(),
            actionStatus: $("#" + context.getId("ddlNextState")).find(":selected").val(),
            userGroupList: context.objects?.userGroupMultiSelect?.getSelectedValues() || [],
            emailGroupList: context.objects?.emailGroupMultiSelect?.getSelectedValues() || [],
            fieldLevelPermission: context.objects?.fieldLevelPermissionMultiSelect?.getSelectedValues(),
            assignTo: $("#" + context.getId("assign")).prop('checked'),
            confirm: $("#" + context.getId("confirmation")).prop('checked'),
            comment: $("#" + context.getId("comment")).prop('checked'),
            onlyForNavigation: $("#" + context.getId("navigation")).prop('checked'),
            notificationPermission: $("#" + context.getId("conditionnotificationPermission")).prop('checked'),
            pushnotificationPermission: $("#" + context.getId("pushnotificationPermission")).prop('checked'),
            redirectForm: $("#" + context.getId("redirectForm")).find(":selected").val(),
            emailtemplateForm: $("#" + context.getId("emailtemplateForm")).find(":selected").val(),
            conditionAcceptedPermission: $("#" + context.getId("conditionAcceptedPermission")).prop('checked'),
            otherEmail: $("#" + context.getId("otherEmailId")).val().split(',').map(email => email.trim()) || []
        };
        if (!actionProperties.userGroupList) {
            actionProperties.userGroupList = [];
        }
        return actionProperties;
    };

    formBuilder.prototype.saveRadioPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.configProperties.excludeFromMob = $("#" + context.getId("excludeFromMobId")).prop('checked');
        currentComponent.configProperties.lovId = $("#" + context.getId("ddlSelectLov")).find(":selected").val();
        currentComponent.configProperties.showInWeb = $("#" + context.getId("showInWebId")).prop('checked');
        currentComponent.configProperties.showInMob = $("#" + context.getId("showInMobId")).prop('checked');
        currentComponent.configProperties.copy = $("#" + context.getId("copyId")).prop('checked');
    }

    formBuilder.prototype.saveCheckboxPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.customId = $("#" + context.getId("customId")).val().trim();
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.configProperties.excludeFromMob = $("#" + context.getId("excludeFromMobId")).prop('checked');
        currentComponent.configProperties.lovId = $("#" + context.getId('ddlSelectLovCheckbox')).find(":selected").val();
        currentComponent.configProperties.showInWeb = $("#" + context.getId("showInWebId")).prop('checked');
        currentComponent.configProperties.showInMob = $("#" + context.getId("showInMobId")).prop('checked');
        currentComponent.configProperties.copy = $("#" + context.getId("copyId")).prop('checked');
    }

    formBuilder.prototype.saveLocationPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.configProperties.locationType = $("#" + context.getId('radioBtnDiv')).find('input[name="location"]:checked').val();
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.configProperties.showInMob = true;
        currentComponent.configProperties.showInWeb = true;
        currentComponent.constraint = "M";
    }

    formBuilder.prototype.saveUserPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.configProperties.userDetail = $("#" + context.getId('radioBtnDiv')).find('input[name="userDetail"]:checked').val();
        currentComponent.configProperties.shortText = $("#" + context.getId("shorttextId")).prop('checked');
        currentComponent.configProperties.showInWeb = $("#" + context.getId("showInWebId")).prop('checked');
        currentComponent.configProperties.showInMob = $("#" + context.getId("showInMobId")).prop('checked');
        currentComponent.configProperties.mapSystemUser = $("#" + context.getId("mapSystemUser")).prop('checked');
    }

    formBuilder.prototype.saveEvaluationPropertiesData = function (currentComponent) {
        var context = this;
        currentComponent.label = $("#" + context.getId("checklabelId")).val().trim();
        currentComponent.configProperties.lovId = $("#" + context.getId("ddlSelectLovEvaluation")).find(":selected").val();
        currentComponent.configProperties.scoreLabel = $("#" + context.getId("evalScoreLabelId")).val().trim();
        currentComponent.constraint = $("#" + context.getId("checkBoxId")).prop('checked') ? "M" : "";
        currentComponent.configProperties.showInWeb = $("#" + context.getId("showInWebId")).prop('checked');
        currentComponent.configProperties.showInMob = $("#" + context.getId("showInMobId")).prop('checked');
    }

    formBuilder.prototype.primaryKeyTrigger = function (isMM) {
        var context = this;
        $("#" + context.getId('primaryKeyId')).on('change', function () {
            if ($(this).prop('checked')) {
                $('#' + context.getId("checkBoxId")).prop("checked", true);
                $('#' + context.getId("checkBoxId")).attr("disabled", "disabled");
                $('#' + context.getId("showInWebId")).prop("checked", true);
                $('#' + context.getId("showInMobId")).prop("checked", true);
            } else {
                $('#' + context.getId("checkBoxId")).removeAttr("disabled");
            }
        });
        $("#" + context.getId('primaryKeyPartition')).on('change', function () {
            if ($(this).prop('checked')) {
                $('#' + context.getId("checkBoxId")).prop("checked", true);
                $('#' + context.getId("checkBoxId")).attr("disabled", "disabled");
            } else {
                $('#' + context.getId("checkBoxId")).removeAttr("disabled");
            }
        });
        $("#" + context.getId('uniqueKeyId')).on('change', function () {
            if ($(this).prop('checked')) {
                $('#' + context.getId("checkBoxId")).prop("checked", true);
                $('#' + context.getId("checkBoxId")).attr("disabled", "disabled");
            } else {
                $('#' + context.getId("checkBoxId")).removeAttr("disabled");
            }
        });
    }

    formBuilder.prototype.hiddenTrigger = function () {
        var context = this;
        $("#" + context.getId('hidden')).on('change', function () {
            if ($(this).prop('checked')) {
                $('#' + context.getId("checkBoxId")).prop("checked", false);
                $('#' + context.getId("primaryKeyId")).prop("checked", false);
                $('#' + context.getId("uniqueKeyId")).prop("checked", false);
                $('#' + context.getId("checkBoxId")).attr("disabled", "disabled");
                $('#' + context.getId("primaryKeyId")).attr("disabled", "disabled");
                $('#' + context.getId("uniqueKeyId")).attr("disabled", "disabled");
            } else {
                $('#' + context.getId("checkBoxId")).removeAttr("disabled");
                $('#' + context.getId("primaryKeyId")).removeAttr("disabled");
                $('#' + context.getId("uniqueKeyId")).removeAttr("disabled");
            }
        });
    }


    formBuilder.prototype.setTemplateData = function () {
        var context = this;
        context.templateData.product = context.product;
        context.templateData.project = context.metaData.projectId;
        context.templateData.module = context.module;
        context.templateData.created_by = context.metaData.userId;
        if (context.template_id) {
            context.templateData.template_id = context.template_id;
        }
        context.templateData.template_name = $("#" + context.getId("template_name")).val()?.trim();
        context.templateData.template_key = $("#" + context.getId("template_key")).val()?.trim();
        context.templateData.feature_id = $("#" + context.getId("ddl_feature_type")).find(":selected").val()
        context.templateData.excluded_from_entity = $("#" + context.getId("excludeFromPartition")).prop('checked');
        context.templateData.mark_as_center_line = $("#" + context.getId("markAsCenterLine")).prop('checked');
        var finalStatus = context.objects?.finalStatus?.getSelectedValues();
        context.templateData.final_status = finalStatus?.join(',');
        context.templateData.result_status = $("#" + context.getId("result_status")).find(":selected").val();
        context.templateData.template_type = $("#" + context.getId("template_type")).val()?.trim();
        context.templateData.definitions = context.definitionList;
        context.templateData.next_seq = context.next_seq;
        context.templateData.dev_options = context.dev_options;
        context.templateData.validation = context.resultData;
        context.templateData.version = context.version;
        context.templateData.clone = context.isClone;
        context.templateData.mandatory_columns = context.mandatory_columns;
        context.templateData.table_name = context.tableName;
        context.templateData.metaData = context.metaData;
        context.validateTemplate(context.templateData);
    }

    formBuilder.prototype.externalValidation = function () {
        var context = this;
        var result = true;
        if (context.callbacks.validation) {
            result = context.callbacks.validation(context.definitionList, context.templateData);
        }
        return result;
    }

    formBuilder.prototype.validateTemplate = function () {
        var context = this;
        if (context.templateData.template_name) {
            if (context.templateData.definitions.length == 0) {
                context.msgList.push(_common.getLocalizedValue("ADD_ATLEAST_ONE_CONTROL"));
            }
            else if (!context.externalValidation()) {
                return;
            }
            else {
                context.saveTemplateApi(context.templateData);
            }
        }
        else {
            context.msgList.push(_common.getLocalizedValue("TEMPLATE_NAME_MANDATORY"));
        }
        context.bindMessage('WARNING');
    }

    formBuilder.prototype.process = function () {
        var context = this;
        context.saveTemplateApi(context.templateData);
    }

    formBuilder.prototype.setSubFormIdEmptyForClone = function (definitionList) {
        definitionList.forEach(definition => {
            if (definition.subType.toLowerCase() === "form") {
                var configProperties = definition.configProperties;
                configProperties["template_id"] = "";
                definition.configProperties = configProperties
            }
        });

    };

    formBuilder.prototype.saveTemplateApi = function (templateData) {
        var context = this;
        context.toggleLoader(1);
        context.basicUiValidation(templateData);
        if (context.msgList.length > 0) {
            context.bindMessage('WARNING');
            context.toggleLoader(0);
        } else {
            formBuilder.post(context.host.anarServiceUrl + "api/saveform", templateData, function (result) {
                if (result.data.template_id) {
                    if (context.callbacks.saveTemplateCallBack) {
                        context.callbacks.saveTemplateCallBack(result.data.template_id, templateData);
                        context.modal(0);
                        context.msgList.push(_common.getLocalizedValue("LBL_SAVED_SUCCESSFULLY"));
                        context.bindMessage('SUCCESS');
                    }
                }
                else if (result.data.definition_ids && result.data.definition_ids.length > 0) {
                    context.newAttributeClick(result.data.definition_ids);
                }
                else if (result.data.deleted_labels && result.data.deleted_labels.length > 0) {
                    context.confirmDeletion(result.data?.deleted_labels);
                }
                else {
                    context.mandatory_columns = {}
                    result.data.forEach(msg => {
                        var value = _common.getLocalizedValue(msg.labelId).format(msg.values)
                        context.msgList.push(value);
                    });
                    context.bindMessage('WARNING');
                }
            }, function () {
                context.toggleLoader(0);
            });
        }
    }

    formBuilder.prototype.basicUiValidation = function (templateData) {
        var context = this;
        if (templateData.definitions) {
            templateData.definitions.forEach(definition => {
                if (definition.subType === "calculatedfields" && definition.configProperties.expression) {
                    var expression = definition.configProperties.expression;
                    var operatorList = ["+", "-", "*", "/", "(", ")", " ", "||"];
                    if (definition.configProperties.expressionArr.some((el, i, arr) => i > 0 && !operatorList.includes(el) && !operatorList.includes(arr[i - 1]))) {
                        context.msgList.push(definition.label + _common.getLocalizedValue('LBL_INVALID_EXPRESSION'));
                        return;
                    }
                    var modifiedExpression = expression.split(',').map(element => {
                        element = element != "Space" ? element.trim() : " ";
                        return operatorList.includes(element) ? element : "1";
                    }).join(' ');
                    if (definition.configProperties.dataSourceType == 'STRING') {
                        if (["||", ")"].includes(modifiedExpression[0]) || ["||", "("].includes(modifiedExpression[modifiedExpression.length - 1])) {
                            context.msgList.push(definition.label + _common.getLocalizedValue('LBL_INVALID_EXPRESSION'));
                        } else {
                            if ((operatorList.includes(modifiedExpression[0]) && modifiedExpression[0] !== "(") || (operatorList.includes(modifiedExpression[modifiedExpression.length - 1]) && modifiedExpression[modifiedExpression.length - 1] !== ")")) {
                                context.msgList.push(definition.label + _common.getLocalizedValue('LBL_INVALID_EXPRESSION'));
                            } else {
                                try {
                                    var result = eval(modifiedExpression);
                                    console.log(result);
                                } catch (error) {
                                    context.msgList.push(definition.label + _common.getLocalizedValue('LBL_INVALID_EXPRESSION'));
                                }
                            }
                        }
                    }
                }
                else if (definition.subType === "number" || definition.subType === "decimal" && definition.configProperties.expression) {
                    var fieldMap = {};
                    context.definitionList.forEach(def => {
                        if (def.id) {
                            fieldMap[def.id] = def.defaultValue || '1';
                        }
                    });
                    var expression = definition.configProperties?.expression ? definition.configProperties.expression.split(',').map(a => fieldMap[a.trim()] || a.trim()).join(' ') : '';
                    var operatorList = ['If', 'Else', 'Then', 'And', 'Or', 'Not', 'Equal To', 'Not Equal To', 'Greater Than', 'Less Than', 'Greater Than Equal To', 'Less Than Equal To', 'Between'];
                    if (expression) {
                        if (definition.configProperties.expressionArr.length < 2 || definition.configProperties.expressionArr.some((el, i, arr) => i > 0 && !operatorList.includes(el) && !operatorList.includes(arr[i - 1]))) {
                            context.msgList.push(definition.label + _common.getLocalizedValue('LBL_INVALID_EXPRESSION'));
                            return;
                        }
                        var modifiedExpression = context.getModifiedExpression(expression);
                        try {
                            if (modifiedExpression.includes("?") && !modifiedExpression.includes(":")) {
                                modifiedExpression += " : 1";
                            }
                            var result = eval(modifiedExpression.trim());
                            console.log(result);
                        } catch (error) {
                            context.msgList.push(definition.label + _common.getLocalizedValue('LBL_INVALID_EXPRESSION'));
                        }
                    }
                }
                else if (definition.subType === 'select' && definition.configProperties?.multiSelect && context.definitionList.find(def => def.subType === 'autoPopulated' && def.configProperties?.attributeId === definition.id)) {
                    context.msgList.push(definition.label + _common.getLocalizedValue('LBL_MULTISELECT_IN_AUTO_POPULATE'));
                    return;
                }
            });
        }
    }

    formBuilder.prototype.getModifiedExpression = function (expression) {
        var context = this;
        var arr = expression.split(',');
        var modifiedExpressionParts = [];
        for (let index = 0; index < arr.length; index++) {
            let element = arr[index].trim();
            switch (element) {
                case 'If':
                    modifiedExpressionParts.push("(");
                    break;
                case 'Then':
                    modifiedExpressionParts.push(") ? (");
                    break;
                case 'Else':
                    modifiedExpressionParts.push(") : (");
                    break;
                case 'And':
                    modifiedExpressionParts.push("&&");
                    break;
                case 'Or':
                    modifiedExpressionParts.push("||");
                    break;
                case 'Not':
                    modifiedExpressionParts.push("!");
                    break;
                case 'Equal To':
                    modifiedExpressionParts.push("===");
                    break;
                case 'Not Equal To':
                    modifiedExpressionParts.push("!==");
                    break;
                case 'Greater Than':
                    modifiedExpressionParts.push(">");
                    break;
                case 'Less Than':
                    modifiedExpressionParts.push("<");
                    break;
                case 'Greater Than Equal To':
                    modifiedExpressionParts.push(">=");
                    break;
                case 'Less Than Equal To':
                    modifiedExpressionParts.push("<=");
                    break;
                case 'Between':
                    if (index > 0 && arr[index + 1] && arr[index + 3] && arr[index + 2] === 'And') {
                        var fieldValue = arr[index - 1].trim();
                        var lowerBound = arr[index + 1].trim();
                        var upperBound = arr[index + 3].trim();
                        var betweenExpression = `>= ${lowerBound} && ${fieldValue} <= ${upperBound}`;
                        modifiedExpressionParts.push(betweenExpression);
                        index += 3;
                    } else {
                        modifiedExpressionParts.push("between");
                    }
                    break;
                default:
                    modifiedExpressionParts.push(element);
                    break;
            }
        }
        var modifiedExpression = modifiedExpressionParts.join(' ').trim();
        if (modifiedExpression.startsWith("(") && !modifiedExpression.endsWith(")")) {
            modifiedExpression += " )";
        }
        return modifiedExpression;
    }

    formBuilder.prototype.newAttributeClick = function (defList) {
        var context = this;
        context.modal(1);
        $("#" + context.getId('modalTitle')).append("Default Value");
        $("#" + context.getId('modalBox')).addClass("lib-modal-sm");
        $("#" + context.getId('modalcontent')).append(context.createContainerForDefaultValue(defList));
        $("#" + context.getId('modalFooter')).append($('<button>').addClass('lib-btn-custom lib-rounded-4').attr('id', context.getId('saveBtn')).text(_common.getLocalizedValue('LBL_SAVE')));
        $("#" + context.getId("saveBtn")).unbind("click").bind("click", function () {
            context.saveMandatoryColumnsData(defList);
            context.setTemplateData();
            context.modal(0);
        });

    }

    formBuilder.prototype.confirmDeletion = function (deleted_ids) {
        var context = this;
        context.modal(1);
        $("#" + context.getId('modalTitle')).append(_common.getLocalizedValue('LBL_CONFIRM_DELETION'));
        $("#" + context.getId('modalBox')).addClass("lib-modal-sm");
        $("#" + context.getId('modalcontent')).append(deleted_ids + " " + _common.getLocalizedValue('LBL_DELETION_CONFIRMATION') + "<br>" + _common.getLocalizedValue('LBL_SAVE_CONFIRMATION'));
        $("#" + context.getId('modalFooter')).append($('<button>').addClass('lib-btn-custom lib-rounded-4').attr('id', context.getId('cancelBtnInd')).text(_common.getLocalizedValue('LBL_CANCEL')));
        $("#" + context.getId('modalFooter')).append($('<button>').addClass('lib-btn-custom lib-rounded-4').attr('id', context.getId('saveBtn')).text(_common.getLocalizedValue('LBL_SAVE')));
        $("#" + context.getId("saveBtn")).unbind("click").bind("click", function () {
            context.templateData["deletionConfirmed"] = true;
            context.saveTemplateApi(context.templateData);
        });
        $("#" + context.getId("cancelBtnInd")).unbind("click").bind("click", function () {
            context.modal(0);
        });
    }

    formBuilder.prototype.createContainerForDefaultValue = function (defList) {
        var context = this;
        var mainContainer = $('<div>', {
            'class': 'lib-responsive-form'
        });
        defList.forEach(def => {
            var definition = context.filter(context.definitionList, { id: def })[0];

            var mainContainerCode = $('<div>', {
                class: 'lib-form-group lib-display-flex lib-align-items-center mb-2',
                'id': context.getId('newAttribute')
            }).append($('<div>', {
                'class': 'lib-col-4',
            }).append($('<label>', {
                'class': 'lib-form-label' + (definition.constraint ? ' mandatory-star-red-after' : ''),
                'text': definition.label,
            }))).append($('<div>', {
                'class': 'lib-col-8',
            }).append($('<input>', {
                'class': 'lib-form-control',
                'type': 'text',
                'id': context.getId(definition.id + '_mandatorycol'),
                'placeholder': definition.subType == "date" ? context.metaData?.dateFormat : "" || definition.subType == "dateTime" ? context.metaData?.dateTimeFormat : ""
            })));
            mainContainer.append(mainContainerCode)
        });
        return mainContainer;
    }

    formBuilder.prototype.saveMandatoryColumnsData = function (defList) {
        var context = this;
        var mandatoryValueList = {};

        for (var i = 0; i < defList.length; i++) {
            var mandatoryValue = $("#" + context.getId(defList[i] + "_mandatorycol")).val().trim();
            mandatoryValueList[defList[i]] = mandatoryValue;
        }
        context.mandatory_columns = mandatoryValueList;
    }

    formBuilder.prototype.saveStatusApi = function (statusValue) {
        var context = this;
        var postData = {};
        postData.statusName = $("#" + context.getId("addNewInitialState")).val().trim();
        postData.id = $("#" + context.getId("addNewInitialState")).attr("data-id");
        postData.product = context.product;
        postData.project = context.metaData.projectId;
        postData.module = context.module;
        postData.userId = context.metaData.userId;
        postData.abbreviation = $("#" + context.getId("addNewAbbreviation")).find(":selected").val();

        formBuilder.post(context.host.anarServiceUrl + "api/savesystemcode", postData, function (result) {

            if (result.data.length > 0) {
                result.data.forEach(msg => {
                    var value = _common.getLocalizedValue(msg.labelId).format(msg.values)
                    context.msgList.push(value);
                });
                context.bindMessage('WARNING');
            } else {

                context.msgList.push("Status Saved Successfully");
                context.bindMessage('SUCCESS');
                $("#" + context.getId("addNewInitialState")).val("");
                $("#" + context.getId("addNewAbbreviation")).val("");
                context.getStatusList();

            }

        }, function () {

        });

    }
    formBuilder.prototype.createMsgContainer = function () {
        var context = this;
        var str = '<div id="' + context.getId('main_msg_container') + '" class="lib-bootoast-container top right">';
        $("#" + this.controlId).append(str);
    }

    formBuilder.prototype.removeById = function (id) {
        var context = this;
        var requiredIndex = context.definitionList.findIndex(el => {
            return el.id === String(id);
        });
        if (requiredIndex === -1) {
            return false;
        };
        return !!context.definitionList.splice(requiredIndex, 1);
    }
    formBuilder.prototype.toggleLoader = function (flag) {
        var context = this;
        if (flag == 1) {
            $('#' + context.getId("loader")).show();
        } else {
            $('#' + context.getId("loader")).hide();
        }
    }

    formBuilder.prototype.bindMessage = function (type) {
        var context = this;
        if (context.msgList.length === 0) {
            return;
        }
        var typeClass = "";
        if (type === "SUCCESS") {
            typeClass = "lib-alert-success";
        } else if (type === "WARNING") {
            typeClass = "lib-alert-warning";
        } else if (type === "ERROR") {
            typeClass = "lib-alert-danger";
        }
        var $mainMsgContainer = $('#' + context.getId('main_msg_container'));
        $mainMsgContainer.empty();
        var $alert = $('<div>', {
            class: 'lib-alert ' + typeClass + ' lib-bootoast alert-dismissable'
        });
        var $button = $('<button>', {
            type: 'button',
            class: 'close',
            text: '×',
            click: function () {
                $mainMsgContainer.hide();
            }
        });
        var $alertContainer = $('<div>', {
            class: 'lib-bootoast-alert-container'
        });
        var $alertContent = $('<div>', {
            class: 'lib-bootoast-alert-content'
        });
        var $ul = $('<ul>', {
            class: 'icon-list'
        });
        context.msgList.forEach(function (msg) {
            var $li = $('<li>').text(msg);
            $ul.append($li);
        });
        context.msgList = [];
        $alertContent.append($ul);
        $alertContainer.append($alertContent);
        $alert.append($button);
        $alert.append($alertContainer);
        $mainMsgContainer.append($alert);
        $mainMsgContainer.show();
        $mainMsgContainer.delay(10000).fadeOut(2000).hide(1000);
    };

    formBuilder.prototype.onPreviewClick = function () {
        var context = this;
        context.modal(1);
        var definition = context.definitionList.filter(item => item.subType !== "form");
        $("#" + context.getId('modalTitle')).append(_common.getLocalizedValue('LBL_PREVIEW'));
        $("#" + context.getId('modalBox')).addClass("lib-modal-xl");
        $("#" + context.getId('modalcontent')).append();
        var objFormCapture = new formCapture(context.getId("modalcontent"))
            .setDefinitions(definition)
            .setHost(context.host)
            .setMetaData(context.metaData)
            .setTheme(context.theme)
            .isPreview(true)
            .setProduct(context.product)
            .previewCancel(function () { context.onPreviewCancelClick(context) })
            .bind();
    }


    formBuilder.prototype.getPreviewContainer = function () {
        var context = this;
        var str = '<div id="' + context.getId("formCapture_Container") + '" class="bg-shadow lib-dynamic-form-container" style="display:none"></div>';
        return str;
    }

    formBuilder.prototype.showHistoryModal = function () {
        var context = this;
        context.modal(1);
        $("#" + context.getId('modalTitle')).append(_common.getLocalizedValue('LBL_HISTORY'));
        $("#" + context.getId('modalBox')).removeClass("lib-modal-sm");
        $("#" + context.getId('modalBox')).addClass("lib-modal-md");
        $("#" + context.getId('modalcontent')).append(context.bindHistory());
    }

    formBuilder.prototype.bindHistory = function () {
        var context = this;
        var formCapture = new formBuilderAudit(context.getId('modalcontent'))
            .setTemplateId(context.template_id)
            .setUserGroupList(context.userGroupData)
            .setMetaData(context.metaData)
            .setTemplateName(context.template_name_history)
            .setHost(context.host)
            .bind()
    }



    formBuilder.prototype.onValidationClick = function () {
        var context = this;
        context.modalValidation(1);
        $("#" + context.getId('btnValidationClose')).hide();
        $("#" + context.getId('modalValidationTitle')).append(_common.getLocalizedValue('LBL_VALIDATIONS'));
        $("#" + context.getId('modalValidationBox')).addClass("lib-modal-xl");
        $("#" + context.getId('modalValidationContent')).append(context.createValidationContainer());
        $("#" + context.getId('modalValidationFooter')).append();
    }

    formBuilder.prototype.createValidationContainer = function () {
        var context = this;
        console.log("definition", context.definitionList);
        var objValidations = new validations(context.getId('modalValidationContent'));
        objValidations.setHost(context.host);
        objValidations.setDefinitionList(context.definitionList);
        objValidations.setData(context.resultData);
        objValidations.setCallbacks({ saveValidationCallBack: function (data) { context.saveValidation(data) } });
        objValidations.bind();
    }

    formBuilder.prototype.saveValidation = function (data) {
        var context = this;
        context.resultData = [];
        context.resultData = data;
        console.log(context.resultData, 'result');
        console.log(context.definitionList, 'result');
        context.modalValidation(0);
    }

    formBuilder.prototype.editStatusList = function () {
        var context = this;
        $("#" + context.getId('ulIntState')).find(".lib-edit-icon").unbind("click").bind("click", function () {
            var editTextValue = $(this).attr("statusname");
            var editId = $(this).attr("statusid");

            $("#" + context.getId('ulIntState')).addClass("disable-section");
            $("#" + context.getId("addNewIntStateBtn")).hide();
            $("#" + context.getId('checkEditBtn')).show();
            $("#" + context.getId("closeBtn")).show();
            var data = context.filter(context.statusList, { id: editId });
            $("#" + context.getId('addNewInitialState')).val(editTextValue);
            $("#" + context.getId('addNewInitialState')).attr("data-id", editId);
            $("#" + context.getId("addNewAbbreviation")).val(data[0]?.abbreviation);

            console.log(editId, 'id of edit')

        });

    }

    formBuilder.prototype.addLovFormRadio = function () {
        var context = this;
        $("#" + context.getId('addLovFromRadio')).unbind('click').click(function () {
            context.openListOfValuePopupModal($("#" + context.getId("ddlSelectLov")).find(":selected").val());
        });
    }
    formBuilder.prototype.addLovFromCheckbox = function () {
        var context = this;
        $("#" + context.getId('addLovFromCheckbox')).unbind('click').click(function () {
            context.openListOfValuePopupModal($("#" + context.getId("ddlSelectLovCheckbox")).find(":selected").val());
        });
    }

    formBuilder.prototype.addLovFromCheckpoint = function () {
        var context = this;
        $("#" + context.getId('addLovFromCheckpoint')).unbind('click').click(function () {
            context.openListOfValuePopupModal($("#" + context.getId("ddlSelectLovCheckpoint")).find(":selected").val());
        });
    }

    formBuilder.prototype.addLovFromEvaluation = function () {
        var context = this;
        $("#" + context.getId('addLovFromEvaluation')).unbind('click').click(function () {
            context.openListOfValuePopupModal($("#" + context.getId("ddlSelectLovEvaluation")).find(":selected").val());
        });
    }

    formBuilder.prototype.editUpdateStatusList = function () {
        var context = this;

        $("#" + context.getId('checkEditBtn')).unbind("click").bind("click", function () {

            var id = $("#" + context.getId('id')).val();
            $("#" + context.getId('ulIntState')).removeClass("disable-section");
            $("#" + context.getId("addNewIntStateBtn")).show();
            $("#" + context.getId('checkEditBtn')).hide();
            $("#" + context.getId("closeBtn")).hide();

            context.saveStatusApi();
            context.getStatusList();
        });

    }

    formBuilder.prototype.closeStatusList = function () {
        var context = this;
        $("#" + context.getId('closeBtn')).unbind("click").bind("click", function () {
            $("#" + context.getId('ulIntState')).removeClass("disable-section");
            $("#" + context.getId("addNewIntStateBtn")).show();
            $("#" + context.getId('checkEditBtn')).hide();
            $("#" + context.getId("closeBtn")).hide();
            $("#" + context.getId("addNewInitialState")).val("");
            context.getStatusList();

        });

    }

    formBuilder.prototype.deleteStatusApi = function (statusId) {
        var context = this;
        var projectId = context.metaData.projectId;
        context.getApiData(context.host.anarServiceUrl + "api/deletesystemCodeStatus/" + statusId + "/" + projectId, function (result) {
            if (result.data && result.data.length > 0) {
                result.data.forEach(msg => {
                    var value = _common.getLocalizedValue(msg.labelId).format(msg.values)
                    context.msgList.push(value);
                });
                context.bindMessage('WARNING');
            }
            else {
                context.msgList.push(_common.getLocalizedValue("LBL_DELETED_SUCCESSFULLY"));
                context.bindMessage('SUCCESS');
                context.getStatusList();
            }
        });
    }

    formBuilder.prototype.onPreviewCancelClick = function (context) {
        $("#" + context.getId("formBuilder_container")).show();
        $("#" + context.getId("formCapture_Container")).hide();
    }

    formBuilder.prototype.bindSpatialProperties = function () {
        var context = this;
        var styleOptions = [
            { value: "", text: _common.getLocalizedValue('LBL_SELECT_STYLE') },
            { value: "circle", "data-tkey": "CIRCLE", text: _common.getLocalizedValue('LBL_CIRCLE') },
            { value: "cross", "data-tkey": "CROSS", text: _common.getLocalizedValue('LBL_CROSS') },
            { value: "diamond", "data-tkey": "DIAMOND", text: _common.getLocalizedValue('LBL_DIAMOND') },
            { value: "triangle", "data-tkey": "TRIANGLE", text: _common.getLocalizedValue('LBL_TRIANGLE') },
            { value: "square", "data-tkey": "SQUARE", text: _common.getLocalizedValue('LBL_SQUARE') }
        ];

        var styleOptionsLine = [
            { value: "", text: _common.getLocalizedValue('LBL_SELECT_STYLE') },
            { value: "solid", "data-tkey": "SIMPLE_LINE", text: _common.getLocalizedValue('LBL_SIMPLE_LINE') },
            { value: "dash", "data-tkey": "DASHED_LINE", text: _common.getLocalizedValue('LBL_DASHED_LINE') },
            { value: "dot", "data-tkey": "DOTTED_LINE", text: _common.getLocalizedValue('LBL_DOTTED_LINE') }
        ];

        var styleSelect = $("<select>", {
            class: "lib-form-control",
            id: context.getId("spatialStyleInput")
        });
        styleOptions.forEach(function (option) {
            var $option = $("<option>", {
                value: option.value,
                "data-tkey": option["data-tkey"],
                text: option.text
            });
            styleSelect.append($option);
        });

        var styleSelectLine = $("<select>", {
            class: "lib-form-control",
            id: context.getId("lineStyleSelect")
        });
        styleOptionsLine.forEach(function (option) {
            var $option = $("<option>", {
                value: option.value,
                "data-tkey": option["data-tkey"],
                text: option.text
            });
            styleSelectLine.append($option);
        });

        var pointStyleDiv = $("<li>", {
            class: "lib-form-group no-change-class lib-prop-p",
            id: context.getId("pointStyleDiv")
        }).append($("<label>", {
            class: "lib-form-label mandatory-star-red-after",
            'data-tkey': context.getUUID(),
            text: _common.getLocalizedValue('LBL_STYLE')
        })).append(styleSelect);

        var lineStyleDiv = $("<li>", {
            class: "lib-form-group no-change-class lib-prop-p",
            id: context.getId("lineStyleDiv")
        }).append($("<label>", {
            class: "lib-form-label mandatory-star-red-after",
            'data-tkey': context.getUUID(),
            text: _common.getLocalizedValue('LBL_STYLE')
        })).append(styleSelectLine);

        var widthDiv = $("<li>", {
            class: "lib-form-group no-change-class lib-prop-p"
        }).append($("<label>", {
            class: "lib-form-label mandatory-star-red-after",
            'data-tkey': context.getUUID(),
            text: _common.getLocalizedValue('LBL_WIDTH')
        })).append($("<input>", {
            type: 'number',
            step: '0.01',
            class: "lib-form-control",
            id: context.getId("spatialWidthInput"),
            autoComplete: 'off',
            required: true
        }));

        var colorDiv = $("<li>", {
            class: "lib-form-group no-change-class lib-prop-p"
        }).append($("<label>", {
            class: "lib-form-label",
            'data-tkey': context.getUUID(),
            text: _common.getLocalizedValue('LBL_COLOR')
        })).append($("<input>", {
            type: "color",
            id: context.getId("spatialColorInput"),
        }));

        var combinedDiv = $("<div>");
        combinedDiv.append(pointStyleDiv).append(lineStyleDiv).append(widthDiv).append(colorDiv);
        context.updateSpatialFieldsBasedOnCoordinateType();
        return combinedDiv;
    }

    formBuilder.prototype.getApiData = function (url, callback, complete, headers) {
        if (!headers) {
            headers = {}
        }

        headers["Authorization"] = 'Bearer ' + localStorage.getItem('token')
        $.ajax({
            url: url,
            contentType: false,
            processData: false,
            headers: headers,
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            success: callback,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status == 401 || XMLHttpRequest.status == 403) {
                    logout();
                }
            },
            complete: complete
        });
    }

    formBuilder.post = function (url, data, callback, complete, headers) {
        if (!headers) {
            headers = {}
        }
        if (containsHtmlOrScriptTags(JSON.stringify(data))) {
            return;
        }
        headers["Authorization"] = 'Bearer ' + localStorage.getItem('token')
        $.ajax({
            url: url,
            data: JSON.stringify(data),
            headers: headers,
            type: "POST",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            xhrFields: {
                withCredentials: true
            },
            success: callback,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status == 401 || XMLHttpRequest.status == 403) {
                    logout();
                }
            },
            complete: complete
        });
    }


    formBuilder.prototype.upload = function (url, blobOrFile, callback, complete) {
        var xhr = new XMLHttpRequest();
        var strFileType = blobOrFile.type;
        if (strFileType == "" || strFileType == undefined || strFileType == null) {
            strFileType = "application/octet-stream";
        }
        strFileType = strFileType.replace('/', '47;');
        xhr.open('POST', url, false);

        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                console.log("e", e)
                //progressBar.value = (e.loaded / e.total) * 100;
                //progressBar.textContent = progressBar.value; // Fallback.
            }
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(JSON.parse(xhr.response));
            }
            complete();
        };
        xhr.onerror = function (e) {
            alert(e);
        }
        //        xhr.withCredentials = true;
        xhr.send(blobOrFile);
    }


    return formBuilder;
}));

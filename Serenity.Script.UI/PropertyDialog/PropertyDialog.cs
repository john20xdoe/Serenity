﻿using jQueryApi;
using jQueryApi.UI.Widgets;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace Serenity
{
    [Imported, Serializable]
    public class DialogButton
    {
        public string Text { get; set; }
        public Action Click { get; set; }
    }

    public abstract partial class PropertyDialog<TEntity, TOptions> : TemplatedDialog<TOptions>
        where TEntity : class, new()
        where TOptions: class, new()
    {
        private TEntity entity;
        private Int64? entityId;

        protected PropertyDialog()
            : this(Q.NewBodyDiv(), null)
        {
        }

        protected PropertyDialog(TOptions opt)
            : this(Q.NewBodyDiv(), opt)
        {
        }

        protected PropertyDialog(jQueryObject div, TOptions opt)
            : base(div, opt)
        {
            if (!IsAsyncWidget())
            {
                #pragma warning disable 618
                InitPropertyGrid();
                LoadInitialEntity();
                #pragma warning restore 618
            }
        }

        protected override void InitializeAsync(Action complete, Action<object> fail)
        {
            base.InitializeAsync(delegate()
            {
                InitPropertyGrid(fail.TryCatch(delegate()
                {
                    LoadInitialEntity();
                    complete();
                }), fail);
            }, fail);
        }

        protected virtual void LoadInitialEntity()
        {
            if (propertyGrid != null)
                propertyGrid.Load(new object());
        }

        protected override DialogOptions GetDialogOptions()
        {
            var opt = base.GetDialogOptions();
            opt.Buttons = GetDialogButtons().As<object[]>();
            opt.Width = 400;
            opt.Title = GetDialogTitle();
            return opt;
        }

        protected virtual string GetDialogTitle()
        {
            return "";
        }

        protected virtual void OkClick()
        {
            if (!ValidateBeforeSave())
                return;

            OkClickValidated();
        }

        protected virtual void OkClickValidated()
        {
            this.DialogClose();
        }

        protected virtual void CancelClick()
        {
            this.DialogClose();
        }

        protected virtual List<DialogButton> GetDialogButtons()
        {
            return new List<DialogButton>
            {
                new DialogButton {
                    Text = "Tamam",
                    Click = OkClick,
                },
                new DialogButton {
                    Text = "İptal",
                    Click = CancelClick
                }
            };
        }

        public override void Destroy()
        {
            if (propertyGrid != null)
            {
                propertyGrid.Destroy();
                propertyGrid = null;
            }

            if (validator != null)
            {
                this.ById("Form").Remove();
                validator = null;
            }

            base.Destroy();
        }

        protected TEntity Entity
        {
            get { return entity; }
            set { entity = value ?? new TEntity(); }
        }

        protected internal Nullable<Int64> EntityId
        {
            get { return entityId; }
            set { entityId = value; }
        }

        protected virtual void UpdateTitle()
        {
        }

        protected override void OnDialogOpen()
        {
            base.OnDialogOpen();
        }

        protected override string GetTemplateName()
        {
            var templateName = base.GetTemplateName();
            
            if (!Q.CanLoadScriptData("Template." + templateName) &&
                Q.CanLoadScriptData("Template.PropertyDialog"))
                return "PropertyDialog";

            return templateName;
        }

        protected PropertyGrid propertyGrid;

        [Obsolete("Prefer async version")]
        private void InitPropertyGrid()
        {
            var pgDiv = this.ById("PropertyGrid");
            if (pgDiv.Length <= 0)
                return;

            #pragma warning disable 618
            var pgOptions = GetPropertyGridOptions();
            #pragma warning restore 618

            propertyGrid = new PropertyGrid(pgDiv, pgOptions);
        }

        private void InitPropertyGrid(Action complete, Action<object> fail)
        {
            fail.TryCatch(delegate()
            {
                var pgDiv = this.ById("PropertyGrid");
                if (pgDiv.Length <= 0)
                {
                    complete();
                    return;
                }

                GetPropertyGridOptions(pgOptions =>
                {
                    fail.TryCatch(delegate()
                    {
                        propertyGrid = new PropertyGrid(pgDiv, pgOptions);
                        propertyGrid.Init(pg =>
                        {
                            complete();
                        }, fail);
                    })();
                }, fail);
            })();
        }

        protected virtual string GetFormKey()
        {
            var attributes = this.GetType().GetCustomAttributes(typeof(FormKeyAttribute), true);
            if (attributes.Length >= 1)
                return attributes[0].As<FormKeyAttribute>().Value;
            else
            {
                var name = this.GetType().FullName;
                var px = name.IndexOf(".");
                if (px >= 0)
                    name = name.Substring(px + 1);

                if (name.EndsWith("Dialog"))
                    name = name.Substr(0, name.Length - 6);
                else if (name.EndsWith("Panel"))
                    name = name.Substr(0, name.Length - 5);

                return name;
            }
        }

        [Obsolete("Prefer async version")]
        protected virtual List<PropertyItem> GetPropertyItems()
        {
            #pragma warning disable 618
            var formKey = GetFormKey();
            return Q.GetForm(formKey);
            #pragma warning restore 618
        }

        protected virtual void GetPropertyItems(Action<List<PropertyItem>> callback, Action<object> fail)
        {
            fail.TryCatch(delegate()
            {
                var formKey = GetFormKey();
                Q.GetForm(formKey, callback, fail);
            })();
        }

        [Obsolete("Prefer async version")]
        protected virtual PropertyGridOptions GetPropertyGridOptions()
        {
            #pragma warning disable 618
            return new PropertyGridOptions
            {
                IdPrefix = this.idPrefix,
                Items = GetPropertyItems(),
                Mode = PropertyGridMode.Insert,
                UseCategories = false,
                LocalTextPrefix = "Forms." + GetFormKey() + "."
            };
            #pragma warning restore 618
        }

        protected virtual void GetPropertyGridOptions(Action<PropertyGridOptions> callback, Action<object> fail)
        {
            GetPropertyItems(propertyItems =>
            {
                fail.TryCatch(delegate()
                {
                    var options = new PropertyGridOptions
                    {
                        IdPrefix = this.idPrefix,
                        Items = propertyItems,
                        Mode = PropertyGridMode.Insert,
                        UseCategories = false
                    };

                    callback(options);
                })();
            }, fail);
        }

        protected virtual bool ValidateBeforeSave()
        {
            return this.validator.ValidateForm();
        }

        protected virtual TEntity GetSaveEntity()
        {
            var entity = new TEntity();

            if (this.propertyGrid != null)
                this.propertyGrid.Save(entity);

            return entity;
        }
    }

    public abstract partial class PropertyDialog<TEntity> : PropertyDialog<TEntity, object>
        where TEntity : class, new()
    {
        public PropertyDialog()
            : base(null)
        {
        }
    }
}
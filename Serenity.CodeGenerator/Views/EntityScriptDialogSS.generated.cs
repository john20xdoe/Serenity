﻿#pragma warning disable 1591
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Serenity.CodeGenerator.Views
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("RazorGenerator", "2.0.0.0")]
    public partial class EntityScriptDialogSS : RazorGenerator.Templating.RazorTemplateBase
    {
#line hidden
 public dynamic Model { get; set; } 
        public override void Execute()
        {


WriteLiteral("\r\n");



                                                   
    var dotModule = Model.Module == null ? "" : ("." + Model.Module);
    var moduleDot = Model.Module == null ? "" : (Model.Module + ".");
    var moduleSlash = Model.Module == null ? "" : (Model.Module + "/");
    var secondComma = Model.Identity != null ? ", " : "";


WriteLiteral("namespace ");


      Write(Model.RootNamespace);


                            Write(dotModule);


                                            WriteLiteral("\r\n{\r\n    using jQueryApi;\r\n    using Serenity;\r\n    using System.Collections.Gene" +
"ric;\r\n\r\n    [");

      if (Model.Identity != null){
WriteLiteral("IdProperty(");


                                               Write(Model.RowClassName);

WriteLiteral(".IdProperty)");


                                                                                           }

                                                                                             if (Model.NameField != null){

                                                                                                                            Write(secondComma);

WriteLiteral("NameProperty(");


                                                                                                                                                       Write(Model.RowClassName);

WriteLiteral(".NameProperty)");


                                                                                                                                                                                                     }
WriteLiteral("]\r\n    [FormKey(\"");


          Write(moduleDot);


                      Write(Model.ClassName);

WriteLiteral("\"), LocalTextPrefix(");


                                                            Write(Model.RowClassName);

WriteLiteral(".LocalTextPrefix), Service(");


                                                                                                            Write(Model.ClassName);

WriteLiteral("Service.BaseUrl)]\r\n    public class ");


             Write(Model.ClassName);

WriteLiteral("Dialog : EntityDialog<");


                                                     Write(Model.RowClassName);

WriteLiteral(">\r\n    {\r\n        protected ");


              Write(Model.ClassName);

WriteLiteral("Form form;\r\n\r\n        public ");


           Write(Model.ClassName);

WriteLiteral("Dialog()\r\n        {\r\n            form = new ");


                   Write(Model.ClassName);

WriteLiteral("Form(this.IdPrefix);\r\n        }\r\n    }\r\n}");


        }
    }
}
#pragma warning restore 1591
﻿using jQueryApi;
using System;
using System.Collections.Generic;
using System.Html;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace Serenity
{
    public static partial class Q
    {
        public static class ScriptData
        {
            private static JsDictionary<string, string> registered = new JsDictionary<string, string>();
            private static JsDictionary<string, object> loadedData = new JsDictionary<string, object>();

            public static void BindToChange(string name, string regClass, Action onChange)
            {
                jQuery.FromObject(Document.Body).As<dynamic>()
                    .bind("scriptdatachange." + regClass, new Action<jQueryEvent, string>((e, s) =>
                {
                    if (s == name)
                        onChange();
                }));
            }

            public static void TriggerChange(string name)
            {
                J(Document.Body).TriggerHandler("scriptdatachange", new object[] { name });
            }

            public static void UnbindFromChange(string regClass)
            {
                jQuery.FromObject(Document.Body)
                    .Unbind("scriptdatachange." + regClass);
            }

            [Obsolete("Prefer asynchronous version")]
            private static void SyncLoadScript(string url)
            {
                jQuery.Ajax(new jQueryAjaxOptions
                {
                    Async = false,
                    Cache = true,
                    Type = "GET",
                    Url = url,
                    Data = null,
                    DataType = "script"
                });
            }

            private static void LoadScript(string url, Action complete, Action<object> fail)
            {
                fail.TryCatch(delegate()
                {
                    Q.BlockUI();

                    jQuery.Ajax(new jQueryAjaxOptions
                    {
                        Async = true,
                        Cache = true,
                        Type = "GET",
                        Url = url,
                        Data = null,
                        DataType = "script"
                    })
                    .Always(() => Q.BlockUndo())
                    .Done(response =>
                    {
                        ((dynamic)complete)(response);
                    })
                    .Fail(response =>
                    {
                        fail(response);
                    });
                })();
            }

            [Obsolete("Prefer asynchronous version")]
            private static void LoadScriptData(string name)
            {
                if (!registered.ContainsKey(name))
                    throw new Exception(String.Format("Script data {0} is not found in registered script list!", name));

                name = name + ".js?" + registered[name];

                #pragma warning disable 618
                SyncLoadScript(Q.ResolveUrl("~/DynJS.axd/") + name);
                #pragma warning restore 618
            }

            private static void LoadScriptData(string name, Action complete, Action<object> fail)
            {
                fail.TryCatch(delegate()
                {
                    if (!registered.ContainsKey(name))
                        throw new Exception(String.Format("Script data {0} is not found in registered script list!", name));

                    name = name + ".js?" + registered[name];

                    LoadScript(Q.ResolveUrl("~/DynJS.axd/") + name, complete, fail);
                })();
            }

            [Obsolete("Prefer asynchronous version")]
            public static object Ensure(string name)
            {
                var data = loadedData[name];

                #pragma warning disable 618
                if (!Script.IsValue(data))
                    LoadScriptData(name);
                #pragma warning restore 618

                data = loadedData[name];

                if (!Script.IsValue(data))
                    throw new NotSupportedException(String.Format("Can't load script data: {0}!", name));

                return data;
            }

            [IncludeGenericArguments(false)]
            public static void Ensure<TData>(string name, Action<TData> complete, Action<object> fail = null)
            {
                fail.TryCatch(delegate()
                {
                    var data = loadedData[name].As<TData>();

                    if (!Script.IsValue(data))
                    {
                        LoadScriptData(name, fail.TryCatch(delegate()
                        {
                            data = loadedData[name].As<TData>();

                            if (!Script.IsValue(data))
                                throw new NotSupportedException(String.Format("Can't load script data: {0}!", name));

                            complete(data);
                        }), fail);

                        return;
                    }

                    complete(data);
                })();
            }

            [Obsolete("Prefer asynchronous version")]
            public static object Reload(string name)
            {
                if (!registered.ContainsKey(name))
                    throw new NotSupportedException(String.Format("Script data {0} is not found in registered script list!"));

                registered[name] = new JsDate().GetTime().ToString();

                #pragma warning disable 618
                LoadScriptData(name);
                #pragma warning restore 618

                var data = loadedData[name];

                return data;
            }

            [IncludeGenericArguments(false)]
            public static void Reload<TData>(string name, Action<TData> complete, Action<object> fail = null)
            {
                fail.TryCatch(delegate()
                {
                    if (!registered.ContainsKey(name))
                        throw new NotSupportedException(String.Format("Script data {0} is not found in registered script list!"));

                    registered[name] = new JsDate().GetTime().ToString();

                    LoadScriptData(name, fail.TryCatch(delegate()
                    {
                        complete(loadedData[name].As<TData>());
                    }), fail);
                })();
            }

            public static bool CanLoad(string name)
            {
                var data = loadedData[name];

                if (Script.IsValue(data) ||
                    registered.ContainsKey(name))
                    return true;

                return false;
            }

            public static void SetRegisteredScripts(JsDictionary<string, string> scripts)
            {
                registered.Clear();
                foreach (var k in scripts)
                    Q.ScriptData.registered[k.Key] = k.Value.ToString();
            }

            public static void Set(string name, object value)
            {
                Q.ScriptData.loadedData[name] = value;
                TriggerChange(name);
            }
        }

        [IncludeGenericArguments(false)]
        [Obsolete("Prefer asynchronous version")]
        public static TData GetRemoteData<TData>(string key)
        {
            #pragma warning disable 618
            return ScriptData.Ensure("RemoteData." + key).As<TData>();
            #pragma warning restore 618
        }

        [IncludeGenericArguments(false)]
        public static void GetRemoteData<TData>(string key, Action<TData> complete, Action<object> fail = null)
        {
            ScriptData.Ensure<TData>("RemoteData." + key, complete, fail);
        }

        [IncludeGenericArguments(false)]
        [Obsolete("Prefer asynchronous version")]
        public static Lookup<TItem> GetLookup<TItem>(string key)
        {
            #pragma warning disable 618
            return ScriptData.Ensure("Lookup." + key).As<Lookup<TItem>>();
            #pragma warning restore 618
        }

        [IncludeGenericArguments(false)]
        public static void GetLookup<TItem>(string key, Action<Lookup<TItem>> complete, Action<object> fail = null)
        {
            ScriptData.Ensure<Lookup<TItem>>("Lookup." + key, complete, fail);
        }

        [Obsolete("Prefer asynchronous version")]
        public static void ReloadLookup(string key)
        {
            #pragma warning disable 618
            ScriptData.Reload("Lookup." + key);
            #pragma warning restore 618
        }

        public static void ReloadLookup(string key, Action complete, Action<object> fail = null)
        {
            ScriptData.Reload<object>("Lookup." + key, o => complete(), fail);
        }

        [IncludeGenericArguments(false)]
        [Obsolete("Prefer asynchronous version")]
        public static List<PropertyItem> GetColumns(string key)
        {
            #pragma warning disable 618
            return ScriptData.Ensure("Columns." + key).As<List<PropertyItem>>();
            #pragma warning restore 618
        }

        public static void GetColumns(string key, Action<List<PropertyItem>> complete, Action<object> fail = null)
        {
            ScriptData.Ensure<List<PropertyItem>>("Columns." + key, complete, fail);
        }

        [IncludeGenericArguments(false)]
        [Obsolete("Prefer asynchronous version")]
        public static List<PropertyItem> GetForm(string key)
        {
            #pragma warning disable 618
            return ScriptData.Ensure("Form." + key).As<List<PropertyItem>>();
            #pragma warning restore 618
        }

        public static void GetForm(string key, Action<List<PropertyItem>> complete, Action<object> fail = null)
        {
            ScriptData.Ensure<List<PropertyItem>>("Form." + key, complete, fail);
        }

        [Obsolete("Prefer asynchronous version")]
        public static string GetTemplate(string key)
        {
            #pragma warning disable 618
            return ScriptData.Ensure("Template." + key).As<string>();
            #pragma warning restore 618
        }

        public static void GetTemplate(string key, Action<string> complete, Action<object> fail = null)
        {
            ScriptData.Ensure<string>("Template." + key, complete, fail);
        }

        public static bool CanLoadScriptData(string name)
        {
            return ScriptData.CanLoad(name);
        }
    }
}
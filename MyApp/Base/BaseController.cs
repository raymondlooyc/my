using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.IO;
using Newtonsoft.Json.Converters;
using System.Web.Configuration;

namespace MyApp.Base
{
    public abstract class BaseController : Controller
    {
        public BaseController()
        {

        }


        public ActionResult HandleException(string UserMessage, Exception ex)
        {
            return View("Error");
        }

        public string GetRayDBConn()
        {
            return WebConfigurationManager.ConnectionStrings["RayDB"].ConnectionString;
        }
    }
}

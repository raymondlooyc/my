using MyApp.Base;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyApp.Areas.RD.Controllers
{
    public class GoogleController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }

    }
}

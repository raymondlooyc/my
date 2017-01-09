using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyApp.Areas.MB.Controllers
{
    public class BuyerController : Controller
    {
        public ActionResult Terms()
        {
            return View();
        }

        public ActionResult Policy()
        {
            return View();
        }

        public ActionResult PolicyBM()
        {
            return View();
        }
    }
}

﻿using System.Web.Mvc;

namespace MyApp.Areas.RD
{
    public class RDAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "RD";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "RD_Default",
                "RD/{controller}/{action}/{id}",
                new { AreaName = "RD", controller = "Home", action = "Index", id = UrlParameter.Optional },
                namespaces: new[] { "MyApp.Areas.RD.Controllers" }
            );

            context.MapRoute(
                 "Defaultdas",
                 "{AreaName}/{controller}/{action}/{id}",
                 new { AreaName = "RD", controller = "Home", action = "Index", id = UrlParameter.Optional }
             );
        }
    }
}
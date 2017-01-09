using System.Web.Mvc;

namespace MyApp.Areas.MB
{
    public class MBAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "MB";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "MB_default",
                "MB/{controller}/{action}/{id}",
                new { controller = "Buyer", action = "Terms", id = UrlParameter.Optional },
                new { controller = "Buyer" },
                namespaces: new[] { "MyApp.Areas.MB.Controllers" }
            );
        }
    }
}

using System.Web;
using System.Web.Optimization;

namespace MyApp
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = false;

            bundles.IgnoreList.Clear();
            //bundles.IgnoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);

            //script
            bundles.Add(new ScriptBundle("~/libs/jquery/js").Include(
                "~/libs/jquery/jquery.min.js"));

            bundles.Add(new ScriptBundle("~/libs/bootstrap/js").Include(
                "~/libs/bootstrap/bootstrap.min.js"));

            bundles.Add(new ScriptBundle("~/libs/jquery.ui/js").Include(
                "~/libs/jquery.ui/jquery-ui-1.8.24.min.js",
                "~/libs/jquery.ui/jquery.dragtable.js"));

            bundles.Add(new ScriptBundle("~/libs/jquery.validate/js").Include(
                "~/libs/jquery.validate/jquery.validate-vsdoc.js",
                "~/libs/jquery.validate/jquery.validate.min.js",
                "~/libs/jquery.validate/jquery.validate.unobtrusive.min.js"));

            bundles.Add(new ScriptBundle("~/libs/modernizr/js").Include(
                "~/libs/modernizr/modernizr-2.6.2.js"));

            bundles.Add(new ScriptBundle("~/libs/jquery.mobile/js").Include(
                "~/libs/jquery.mobile/jquery.mobile-1.2.0.min.js"));

            bundles.Add(new ScriptBundle("~/libs/umarket/js").Include(
                "~/libs/owl.carousel/owl.carousel.min.js",
                "~/Scripts/umarket/custom.js"));

            bundles.Add(new ScriptBundle("~/libs/app/js").Include(
                "~/Scripts/app/app.js"));


            //style
            bundles.Add(new StyleBundle("~/libs/jquery.mobile/css").Include(
                "~/libs/jquery.mobile/jquery.mobile-1.2.0.min.css"));

            bundles.Add(new StyleBundle("~/libs/jquery.ui/css").Include(
                "~/libs/jquery.ui/jquery.ui.core.css",
                "~/libs/jquery.ui/jquery.ui.resizable.css",
                "~/libs/jquery.ui/jquery.ui.selectable.css",
                "~/libs/jquery.ui/jquery.ui.accordion.css",
                "~/libs/jquery.ui/jquery.ui.autocomplete.css",
                "~/libs/jquery.ui/jquery.ui.button.css",
                "~/libs/jquery.ui/jquery.ui.dialog.css",
                "~/libs/jquery.ui/jquery.ui.slider.css",
                "~/libs/jquery.ui/jquery.ui.tabs.css",
                "~/libs/jquery.ui/jquery.ui.datepicker.css",
                "~/libs/jquery.ui/jquery.ui.progressbar.css",
                "~/libs/jquery.ui/jquery.ui.theme.css"));

            bundles.Add(new StyleBundle("~/libs/umarket/css").Include(
                "~/libs/bootstrap/bootstrap.min.css",
                "~/libs/font-awesome/font-awesome.min.css",
                "~/libs/umarket/owl.carousel.css",
                "~/libs/umarket/color/red.css",
                "~/libs/umarket/custom.css"));

            bundles.Add(new StyleBundle("~/libs/base/css").Include(
                "~/libs/bootstrap/bootstrap.min.css",
                "~/libs/font-awesome/font-awesome.min.css"));

            bundles.Add(new StyleBundle("~/libs/ray/css").Include(
                "~/libs/ray/ray.css"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/site.css"));
        }
    }
}
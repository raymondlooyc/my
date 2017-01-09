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

            bundles.Add(new ScriptBundle("~/bundles/jquery/jquery").Include(
                "~/Scripts/jquery/jquery.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap/bootstrap").Include(
                "~/Scripts/bootstrap/bootstrap*"));

            bundles.Add(new ScriptBundle("~/bundles/jquery/jqueryui").Include(
                "~/Scripts/jquery/jquery-ui*"));

            bundles.Add(new ScriptBundle("~/bundles/jquery/plugin").Include(
                "~/Scripts/jquery/jquery.dragtable.js"));

            bundles.Add(new ScriptBundle("~/bundles/jquery/jqueryval").Include(
                "~/Scripts/jquery/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr/modernizr").Include(
                "~/Scripts/modernizr/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/jquery/jquerymobile").Include(
                "~/Scripts/jquery/jquery.mobile*"));

            bundles.Add(new ScriptBundle("~/bundles/umarket/umarket").Include(
                "~/Scripts/umarket/owl.carousel.min.js",
                "~/Scripts/umarket/custom.js"));

            bundles.Add(new ScriptBundle("~/bundles/app/app").Include(
                "~/Scripts/app/app.js"));

            bundles.Add(new StyleBundle("~/Content/mobilecss").Include(
                "~/Content/jquery.mobile*"));

            bundles.Add(new StyleBundle("~/Content/themes/jqueryui/css").Include(
                "~/Content/themes/jqueryui/jquery.ui.core.css",
                "~/Content/themes/jqueryui/jquery.ui.resizable.css",
                "~/Content/themes/jqueryui/jquery.ui.selectable.css",
                "~/Content/themes/jqueryui/jquery.ui.accordion.css",
                "~/Content/themes/jqueryui/jquery.ui.autocomplete.css",
                "~/Content/themes/jqueryui/jquery.ui.button.css",
                "~/Content/themes/jqueryui/jquery.ui.dialog.css",
                "~/Content/themes/jqueryui/jquery.ui.slider.css",
                "~/Content/themes/jqueryui/jquery.ui.tabs.css",
                "~/Content/themes/jqueryui/jquery.ui.datepicker.css",
                "~/Content/themes/jqueryui/jquery.ui.progressbar.css",
                "~/Content/themes/jqueryui/jquery.ui.theme.css"));


            bundles.Add(new StyleBundle("~/Content/themes/umarket").Include(
                "~/Content/themes/base/bootstrap.min.css",
                "~/Content/themes/base/font-awesome.min.css",
                "~/Content/themes/umarket/owl.carousel.css",
                "~/Content/themes/umarket/color/red.css",
                "~/Content/themes/umarket/custom.css"));


            bundles.Add(new StyleBundle("~/Content/themes/base").Include(
                "~/Content/themes/base/bootstrap.min.css",
                "~/Content/themes/base/font-awesome.min.css"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/themes/ray").Include(
                "~/Content/themes/ray.css"));
        }
    }
}
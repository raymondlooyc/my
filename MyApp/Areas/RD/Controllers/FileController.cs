using MyApp.ViewModel;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace MyApp.Areas.RD.Controllers
{
    public class FileController : Controller
    {
        #region private variables

        //we init this once so that if the function is repeatedly called
        //it isn't stressing the garbage man
        private static Regex r;

        #endregion

        public FileController()
        {
            r = new Regex(":");
        }


        #region private method

        public ActionResult Index()
        {
            DateTime dateTaken = GetDateTakenFromImage(@"C:\Users\raymond.loo.Fusionex\Desktop\0bcd2039c188287797bddb3a51d3edf107194703.jpg");
            return View();
        }

        public ActionResult GetFileInfo(HttpPostedFileBase file)
        {
            BinaryReader b = new BinaryReader(file.InputStream);
            byte[] binData = b.ReadBytes((int)file.InputStream.Length);
            MemoryStream ms = new MemoryStream();
            ms.Write(binData, 0, binData.Length);

            DateTime dateTaken = GetDateTakenFromImage(ms);

            FileModel fileModel = new FileModel
            {
                ImageTaken = dateTaken
            };

            return View("Index", fileModel);
        }

        #endregion


        #region private method

        //retrieves the datetime WITHOUT loading the whole image
        public static DateTime GetDateTakenFromImage(MemoryStream fs)
        {
            using (Image myImage = Image.FromStream(fs, false, false))
            {
                PropertyItem propItem = myImage.GetPropertyItem(36867);
                string dateTaken = r.Replace(Encoding.UTF8.GetString(propItem.Value), "-", 2);
                return DateTime.Parse(dateTaken);
            }
        }

        //retrieves the datetime WITHOUT loading the whole image
        public static DateTime GetDateTakenFromImage(string path)
        {
            // Create an Image object. 
            Image image = new Bitmap(path);

            // Get the PropertyItems property from image.
            PropertyItem[] propItems = image.PropertyItems;

            // Set up the display.
            Font font = new Font("Arial", 12);
            SolidBrush blackBrush = new SolidBrush(Color.Black);
            int X = 0;
            int Y = 0;

            // For each PropertyItem in the array, display the ID, type, and 
            // length.
            int count = 0;
            foreach (PropertyItem propItem in propItems)
            {
                string dateTaken = r.Replace(Encoding.UTF8.GetString(propItem.Value), "-", 2);
            }

            return DateTime.Now;
        }


        #endregion
    }
}

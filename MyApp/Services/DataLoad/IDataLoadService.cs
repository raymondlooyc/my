using System.Data;

namespace MyApp.Services.DataLoad
{
    public interface IDataLoadService
    {
        DataLoadService Create(string fileLocation);
        DataSet LoadData();
    }
}
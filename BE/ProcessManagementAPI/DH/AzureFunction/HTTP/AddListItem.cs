using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ProcessManagementAPI.DH.AzureFunction.Source;
using ProcessManagementAPI.DH.AzureFunction.Models;
using Newtonsoft.Json;
using System.Net.Http;

namespace ProcessManagementAPI.DH.AzureFunction.HTTP
{
    public static class AddListItem
    {
        [FunctionName("AddListItem")]
        public static async Task<string> Run(
             [HttpTrigger(AuthorizationLevel.Function, "post", Route = "addListItem")] HttpRequestMessage req ,
              ILogger log)
        {
            try
            {
                // Read the request body into a string
                string requestBody = await req.Content.ReadAsStringAsync();

                // Deserialize the JSON request body into an APIRequestInfo instance
                APIRequestInfo requestInfo = JsonConvert.DeserializeObject<APIRequestInfo>(requestBody);

                string newItemId = await SPHelper.AddListItemApi(requestInfo.siteUrl, requestInfo.listName, requestInfo.dataObjectEmployee, log);

                return newItemId;
            }
            catch (Exception ex)
            {
                log.LogError("AddListItem Error {0} {1} {2} {3}", ex.Message, ex.Source, ex.InnerException, ex.StackTrace);
                //return new BadRequestObjectResult(ex.Message);
                return null;
            }
        }
    }
}

using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net.Http;
using ProcessManagementAPI.DH.AzureFunction.Models;
using ProcessManagementAPI.DH.AzureFunction.Source;

namespace ProcessManagementAPI.DH.AzureFunction.HTTP
{
    public static class AddListLeaveItem
    {
        [FunctionName("AddListLeaveItem")]
        public static async Task<string> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "addListLeaveItem")] HttpRequestMessage req,
              ILogger log)
        {
            try
            {
                // Read the request body into a string
                string requestBody = await req.Content.ReadAsStringAsync();

                // Deserialize the JSON request body into an APIRequestInfo instance
                APIRequestInfo requestInfo = JsonConvert.DeserializeObject<APIRequestInfo>(requestBody);

                string newItemId = await SPHelper.AddListLeaveItemApi(requestInfo.siteUrl, requestInfo.listName, requestInfo.dataObjectLeave, log);

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

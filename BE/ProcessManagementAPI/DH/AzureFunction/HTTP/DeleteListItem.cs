using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using ProcessManagementAPI.DH.AzureFunction.Models;
using ProcessManagementAPI.DH.AzureFunction.Source;

namespace ProcessManagementAPI.DH.AzureFunction.HTTP
{
    public static class DeleteListItem
    {
        [FunctionName("DeleteListItems")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "deleteListItem/{itemId}")] APIRequestInfo req,
            ILogger log)
        {
            log.LogInformation(string.Format("DeleteListItem: List {0}, ItemId {1}", req.listName, req.itemId));

            string result = await SPHelper.DeleteListItem(req.siteUrl, req.listName, req.itemId, log);

            return new OkObjectResult(result);
        }
    }
}

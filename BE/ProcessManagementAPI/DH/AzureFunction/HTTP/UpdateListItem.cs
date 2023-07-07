using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using ProcessManagementAPI.DH.AzureFunction.Source;
using ProcessManagementAPI.DH.AzureFunction.Models;
using System.Net.Http;
using System.Net;

namespace ProcessManagementAPI.DH.AzureFunction.HTTP
{
    public static class UpdateListItem
    {
        [FunctionName("UpdateListItem")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "updateListItem")] HttpRequest req,
            ILogger log)
        {
            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var apiRequest = JsonConvert.DeserializeObject<APIRequestInfo>(requestBody);

                var success = await SPHelper.UpdateListItemApi(apiRequest.siteUrl, apiRequest.listName, apiRequest.itemId, apiRequest.dataObjectEmployee, log);

                if (success)
                {
                    return new OkObjectResult("List item updated successfully");
                }
                else
                {
                    return new BadRequestObjectResult("Failed to update list item");
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Failed to update list item");
                return new StatusCodeResult(500);
            }
        }
    }
}

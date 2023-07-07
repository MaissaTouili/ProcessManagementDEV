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
    public static class UpdateLeaveListItem
    {
        [FunctionName("UpdateLeaveListItem")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "updateLeaveListItem")] HttpRequest req,
            ILogger log)
        {
            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var apiRequest = JsonConvert.DeserializeObject<APIRequestInfo>(requestBody);

                var success = await SPHelper.UpdateLeaveListItemApi(apiRequest.siteUrl, apiRequest.listName, apiRequest.itemId, apiRequest.dataObjectLeave, log);

                if (success)
                {
                    return new OkObjectResult("List Leaves item updated successfully");
                }
                else
                {
                    return new BadRequestObjectResult("Failed to update list leaves item");
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Failed to update list leaves item");
                return new StatusCodeResult(500);
            }
        }
    }
}

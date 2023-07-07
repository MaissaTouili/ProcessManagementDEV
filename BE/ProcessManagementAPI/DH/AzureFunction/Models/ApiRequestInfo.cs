using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProcessManagementAPI.DH.AzureFunction.Models
{
    public class APIRequestInfo
    {
        public string listName { get; set; }
        public string siteUrl { get; set; }
        public string filter { get; set; }
        public Employee dataObjectEmployee { get; set; }
        public Leave dataObjectLeave { get; set; }
        public string itemId { get; set; }
     
    }


    public class Rootobject
    {
        [JsonProperty("odata.metadata")]
        public string odatametadata { get; set; }

        [JsonProperty("odata.nextLink")]
        public string odatanextLink { get; set; }

        [JsonProperty("value")]
        public IList<object> value { get; set; }
    }
}

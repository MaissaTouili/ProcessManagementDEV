using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProcessManagementAPI.DH.AzureFunction.Models
{
    public class PresenceCollection
    {
        [JsonProperty("value")]
        public List<Presence> Value { get; set; }
    }

    public class Presence
    {
        [JsonProperty("activity")]
        public string Activity { get; set; }
        [JsonProperty("timelineStart")]
        public DateTime TimelineStart { get; set; }
        [JsonProperty("timelineEnd")]
        public DateTime TimelineEnd { get; set; }
    }

}

using System;
using System.Collections.Generic;
using System.Text;

namespace ProcessManagementAPI.DH.AzureFunction.Source
{
    class Constants
    {
        public static string ClientID = Environment.GetEnvironmentVariable("ClientID");
        public static string ClientSecret = Environment.GetEnvironmentVariable("ClientSecret");
        public static string TenantID = Environment.GetEnvironmentVariable("TenantID");
        public static string Tenant = Environment.GetEnvironmentVariable("Tenant");

        public static string GraphApiClientID = Environment.GetEnvironmentVariable("GraphApiClientID");
        public static string GraphApiClientSecret = Environment.GetEnvironmentVariable("GraphApiClientSecret");
        public static string GraphApiTenantID = Environment.GetEnvironmentVariable("GraphApiTenantID");
        public static string GraphApiAuthority = Environment.GetEnvironmentVariable("GraphApiAuthority");
    }

}

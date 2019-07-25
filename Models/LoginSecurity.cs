using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class LoginSecurity
    {
        public string JWT_Secrete { get; set; }

        public string Client_URL { get; set; }
    }
}

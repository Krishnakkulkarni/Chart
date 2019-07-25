using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.Models;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationsController : ControllerBase
    {
        public readonly AutenticationContext autentication;

        public OperationsController(AutenticationContext context)
        {
            autentication = context;
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> Add(Operations operations)
        {
            try
            {
                var operation = new Operations()
                {
                    Name = operations.Name,
                    YearOfJoin = operations.YearOfJoin,
                    YearOfLeave = operations.YearOfLeave
                };
                this.autentication.Operations.Add(operation);
                var result = await this.autentication.SaveChangesAsync();
                return this.Ok(result);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        [HttpGet]
        [Route("{userId}")]
        public IList<object> View(string userId)
        {
            try
            {
                var mini = autentication.Operations.Min(a => a.YearOfJoin);
                var maxi = autentication.Operations.Max(a => a.YearOfJoin);
                var list = new List<object>();
                var Operation = from a in autentication.Operations
                              where a.YearOfJoin <= maxi
                              group 1 by a.YearOfJoin into grouped
                              select new { year = grouped.Key, item = grouped.Count() };

                for (var i = mini; i <= maxi; i ++)
                {
                    var Operations = from a in autentication.Operations
                                   where a.YearOfJoin <= i && !(a.YearOfLeave >= mini && a.YearOfLeave <= i)
                                   select a;
                    list.Add(Operations.Count());
                    list.Add(i);
                }
                return list;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
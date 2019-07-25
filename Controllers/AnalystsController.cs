using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebApi.HubConfig;
using WebApi.Models;
using WebApi.TimerFeatures;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalystsController : ControllerBase
    {
        public readonly AutenticationContext autentication;

        //private IHubContext<ChartHub> _hub;, IHubContext<ChartHub> hub

        public AnalystsController(AutenticationContext autentication)
        {
            this.autentication = autentication;
            //_hub = hub;
        }

        //public IActionResult Get()
        //{
        //    var timerManager = new TimerManager(() => _hub.Clients.All.SendAsync("transferchartdata"));

        //    return Ok(new { Message = "Request Completed" });
        //}

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> Add(Analysts analysts)
        {
            try
            {
                var analyst = new Analysts()
                {
                    Name = analysts.Name,
                    YearOfJoin = analysts.YearOfJoin,
                    YearOfLeave = analysts.YearOfLeave
                };
                this.autentication.Analysts.Add(analyst);
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
                var mini = autentication.Analysts.Min(a => a.YearOfJoin);
                var maxi = autentication.Analysts.Max(a => a.YearOfJoin);
                var list = new List<object>();
                var analyst = from a in autentication.Analysts
                              where a.YearOfJoin <= maxi
                              group 1 by a.YearOfJoin into grouped
                select new { year = grouped.Key, item = grouped.Count() };

                for(var i = mini; i <= maxi; i ++)
                {
                    var analysts = from a in autentication.Analysts
                                  where a.YearOfJoin <= i && !(a.YearOfLeave >= mini && a.YearOfLeave <= i)
                                   select a;
                    list.Add(analysts.Count());
                    list.Add(i);
                }
                return list;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        [HttpGet]
        [Route("excel/{userId}")]
        public IEnumerable<object> Getexcel(string userId)
        {
            var list = new List<object>();
            var item = from a in autentication.Analysts select a;
            foreach (var a in item)
            {
                list.Add(a);
            }
            var list1 = new List<object>();
            var item1 = from m in autentication.Managers select m;
            foreach (var m in item1)
            {
                list1.Add(m);
            }
            var list2 = new List<object>();
            var item2 = from o in autentication.Operations select o;
            foreach (var o in item2)
            {
                list2.Add(o);
            }
            var list3 = new List<object>();
            var item3 = from s in autentication.Sales select s;
            foreach (var s in item3)
            {
                list3.Add(s);
            }

            return new List<List<object>>{ list,list1,list2,list3 };
        }
    }
}
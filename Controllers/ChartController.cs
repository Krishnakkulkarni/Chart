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
    public class ChartController : ControllerBase
    {
        public readonly AutenticationContext autentication;

        private IHubContext<ChartHub> _hub;

        public ChartController(AutenticationContext context, IHubContext<ChartHub> hub)
        {
            autentication = context;
            _hub = hub;
        }

        [HttpGet]
        [Route("get/{userid}")]
        public IActionResult Get(string userId)
        {
            string checkRole = (from s in autentication.ApplicationUsers where s.Id.Equals(userId) select s.Role).Single();

            if (checkRole.Equals("Manager"))
            {
                _hub.Clients.All.SendAsync("data", new ManagersController(autentication).View(userId));
            }
            else if (checkRole.Equals("Analyst"))
            {
                _hub.Clients.All.SendAsync("data", new AnalystsController(autentication).View(userId));
            }
            else if (checkRole.Equals("Operations"))
            {
                _hub.Clients.All.SendAsync("data", new OperationsController(autentication).View(userId));
            }
            else if (checkRole.Equals("sales"))
            {
                _hub.Clients.All.SendAsync("data", new SalesController(autentication).View(userId));
            }
            else
            {
                Console.WriteLine("wrong role choosen");
            }
            //return RedirectToAction("View", "AnalystsController ", new { id = userId });
            //_hub.Clients.All.SendAsync("data", new AnalystsController(autentication).View(userId));
            return Ok(new { Message = "Request Completed" });
        }
    }
}
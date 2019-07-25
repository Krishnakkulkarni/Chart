﻿using System;
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
    public class SalesController : ControllerBase
    {
        public readonly AutenticationContext autentication;

        public SalesController(AutenticationContext context)
        {
            autentication = context;
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> Add(Sales sales)
        {
            try
            {
                var sale = new Sales()
                {
                    Name = sales.Name,
                    YearOfJoin = sales.YearOfJoin,
                    YearOfLeave = sales.YearOfLeave
                };
                this.autentication.Sales.Add(sale);
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
                var mini = autentication.Sales.Min(a => a.YearOfJoin);
                var maxi = autentication.Sales.Max(a => a.YearOfJoin);
                var list = new List<object>();
                var Sale = from a in autentication.Sales
                                where a.YearOfJoin <= maxi
                                group 1 by a.YearOfJoin into grouped
                                select new { year = grouped.Key, item = grouped.Count() };

                for (var i = mini; i <= maxi; i ++)
                {
                    var Sales = from a in autentication.Sales
                                where a.YearOfJoin <= i && !(a.YearOfLeave >= mini && a.YearOfLeave <= i)
                                     select a;
                    list.Add(Sales.Count());
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
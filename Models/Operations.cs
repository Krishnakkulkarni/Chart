using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class Operations
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public int YearOfJoin { get; set; }

        public int YearOfLeave { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime ModifiedOn { get; set; }
    }
}

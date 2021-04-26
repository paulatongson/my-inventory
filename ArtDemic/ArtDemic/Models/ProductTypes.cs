using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ArtDemic.Models
{
    public class ProductTypes
    {
        public int Id { get; set; }
        [Required]
        [Display(Name ="Category")]
        public string ProductType {get; set;}
    }
}

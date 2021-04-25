using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ArtdemicProj.ViewModel
{
    public class ItemView
    {
        public Guid ItemID { get; set; }
        public int CategoryID { get; set; }
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string Description { get; set; }
        public decimal ItemPrice { get; set; }
        public HttpPostedFileBase ImagePath { get; set; }

        public IEnumerable<SelectListItem> CategorySelectListItem { get; set; }


    }
}
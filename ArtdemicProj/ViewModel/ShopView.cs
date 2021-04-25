using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArtdemicProj.ViewModel
{
    public class ShopView
    {
        public Guid ItemID { get; set; }

        public string ItemName { get; set; }

        public decimal ItemPrice { get; set; }

        public string ImagePath { get; set; }

        public string Description { get; set; }

        public string Category { get; set; }

        public string ItemCode { get; set; }

    }
}
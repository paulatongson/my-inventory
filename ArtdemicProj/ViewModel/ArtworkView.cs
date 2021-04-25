using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ArtdemicProj.ViewModel
{
    public class ArtworkView
    {
        public Guid ArtworkID { get; set; }
        public string ArtCode { get; set; }
        public string ArtName { get; set; }
        public string Artist { get; set; }
        public decimal ArtPrice { get; set; }
        public HttpPostedFileBase ImagePath { get; set; }


    }
}
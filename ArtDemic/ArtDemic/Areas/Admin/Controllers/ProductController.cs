using ArtDemic.Data;
using ArtDemic.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ArtDemic.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class ProductController : Controller
    {
        private ApplicationDbContext _db;
        private IHostingEnvironment _he;
        public ProductController(ApplicationDbContext db,IHostingEnvironment he)
        {
            _db = db;
            _he = he;
        }
        public IActionResult Index()
        {
            var prods = _db.Products.ToList();
            return View(prods);
        }
        public IActionResult Create()
        {
            ViewData["productTypeId"] = new SelectList(_db.ProductTypes.ToList(), "Id", "ProductType");
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Create(Products products,IFormFile image)
        {
            if(ModelState.IsValid)
            {
                if(image!=null)
                {
                    var name = Path.Combine(_he.WebRootPath + "/Images", Path.GetFileName(image.FileName));
                    await image.CopyToAsync(new FileStream(name, FileMode.Create));
                    products.Image = "Images/" + image.FileName;
                }
                if(image==null)
                {
                    products.Image = "Images/noimage.png";
                }
                _db.Products.Add(products);
                await _db.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(products);
        }


        public ActionResult Edit()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Edit(int? id, Products products)
        {
            var prod = _db.Products.Where(i => i.Id == id).SingleOrDefault();

            prod.Image = "Images/noimage.png";
            prod.IsAvailable = products.IsAvailable;
            prod.Name = products.Name;
            prod.Price = products.Price;
            prod.ProductTypeId = products.ProductTypeId;
            prod.ProductTypes = products.ProductTypes;

            _db.Products.Update(prod);
            _db.SaveChanges();

            return RedirectToAction("Index");
        }

       
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using ArtdemicProj.ViewModel;
using ArtdemicProj.Models;

namespace ArtdemicProj.Controllers
{
    public class AdminController : Controller
    {
        private ECommsEntities objECommsEntities;

        public AdminController()
        {
            objECommsEntities = new ECommsEntities();

        }
        public ActionResult Index()
        {
            var list = objECommsEntities.Items.ToList();
            return View(list);
        }

        // Create
        public ActionResult Create()
        {
            return View();
        }

        public ActionResult Create(Item record)
        {
            var item = new Item();
            {
                item.CategoryID = record.CategoryID;
                item.Description = record.Description;
                item.ImagePath = record.ImagePath;
                item.ItemCode = record.ItemCode;
                item.ItemID = record.ItemID;
                item.ItemName = record.ItemName;
                item.ItemPrice = record.ItemPrice;
            };
            objECommsEntities.Items.Add(item);
            objECommsEntities.SaveChanges();

            return RedirectToAction("Index");
        }
        //Delete
        public ActionResult Delete()
        {
            return View();
        }

        // Delete Function
        public ActionResult Delete(Guid? id)
        {
            if (id == null)
            {
                return RedirectToAction("Index");
            }
            var item = objECommsEntities.Items.Where(i => i.ItemID == id).SingleOrDefault();
            if (item == null)
            {
                return RedirectToAction("Index");
            }
            objECommsEntities.Items.Remove(item);
            objECommsEntities.SaveChanges();
            return RedirectToAction("Index");
        }

        //Edit
        public ActionResult Edit()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Edit(Guid? id, Item record)
        {
            var item = objECommsEntities.Items.Where(i => i.ItemID == id).SingleOrDefault();
            item.CategoryID = record.CategoryID;
            item.Description = record.Description;
            item.ImagePath = record.ImagePath;
            item.ItemCode = record.ItemCode;
            item.ItemID = record.ItemID;
            item.ItemName = record.ItemName;
            item.ItemPrice = record.ItemPrice;

            objECommsEntities.Items.Remove(item);
            objECommsEntities.Items.Add(item);
            objECommsEntities.SaveChanges();
            return RedirectToAction("Index");
        }

    }
}
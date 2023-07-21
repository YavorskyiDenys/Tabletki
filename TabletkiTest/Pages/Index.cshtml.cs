using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace TabletkiTest.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }

    }

    internal class Card
    {
        public int Id { get; set; }
        public int PackSum { get; set; }
        public string ImgUrl { get; set; }
        public string Title { get; set; }
        public string Produced { get; set; }
        public string Price { get; set; }
        public bool IsRecomended { get; set; }
    }

    internal class Basket
    {
        public string OrderNumber { get; set; }
        public string OrderTime { get; set; }
        public string Company { get; set; }
        public string CompanyWorkTime { get; set; }
        public string CompanyAddress { get; set; }
        public int TotalProducts { get; set; }
        public int TotalSum { get; set; }
        public bool OrderStatus { get; set; }
        public bool IsRecomended { get; set; }
    }

    internal class StatusMap
    {
        public bool Processing { get; set; }
        public bool Completed { get; set; }
    }
}
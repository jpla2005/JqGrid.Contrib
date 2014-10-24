using System.Collections.Generic;

namespace JqGrid.Contrib
{
    public class ModelFilter
    {
        public ModelFilter()
        {
            FieldFilters = new List<FieldFilter>();
        }
        public string FormId { get; set; }
        public string GridId { get; set; }

        public string @Class { get; set; }

        public IEnumerable<FieldFilter> FieldFilters { get; set; }
    }
}
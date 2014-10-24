using System;
using System.ComponentModel;
using System.Web.Mvc;
using MvcJqGrid;
using MvcJqGrid.Enums;

namespace JqGrid.Contrib
{
    public static class Grids
    {
        public static Grid MyjqGrid(this HtmlHelper htmlHelper, string id, int pageSize = 10, string onGridComplete = "")
        {
            var obj = new Grid(id)
                .SetRequestType(RequestType.Get)
                .SetRowNum(pageSize)
                .SetSortOrder(SortOrder.Asc)
                .SetShrinkToFit(true)
                .SetAutoWidth(true)
                .SetShowAllSortIcons(true)
                .SetViewRecords(true)
                .SetLoadText("Cargando...")
                .SetEmptyRecords("No Existen registros")
                .OnLoadComplete("updateGridInfo(this)")
                .SetAltRows(true).SetAltClass("altClass");

            if (!String.IsNullOrEmpty(onGridComplete))
                obj.OnGridComplete(onGridComplete);
            return obj;
        }

        #region Column methods

        private static Column Column(string columnName, object columnProperties = null)
        {
            var column = new Column(columnName).SetHidden(true);
            ApplyProperties(column, columnProperties);
            return column;
        }

        private static Column Column(string columnName, int width, string columnLabel, object columnProperties = null)
        {
            var column = new Column(columnName).SetWidth(width).SetLabel(columnLabel);
            ApplyProperties(column, columnProperties);
            return column;
        }

        private static void ApplyProperties(Column column, object columnProperties)
        {
            if (columnProperties == null) return;
            var columnType = column.GetType();
            foreach (PropertyDescriptor propertyDescriptor in TypeDescriptor.GetProperties(columnProperties))
            {
                var name = "set" + propertyDescriptor.Name;
                var methodInfo = columnType.GetMethod(name, new[] { propertyDescriptor.PropertyType });
                if (methodInfo == null) throw new InvalidOperationException("Invalid method: " + name + ".");
                methodInfo.Invoke(column, new[] { propertyDescriptor.GetValue(columnProperties) });
            }
        }

        #endregion

        #region Grid methods

        public static Grid Column(this Grid grid, string columnName, object columnProperties = null)
        {
            if (grid == null) throw new ArgumentNullException("grid");
            grid.AddColumn(Column(columnName, columnProperties));
            return grid;
        }

        public static Grid Column(this Grid grid, string columnName, int width, string columnLabel, object columnProperties = null)
        {
            if (grid == null) throw new ArgumentNullException("grid");
            grid.AddColumn(Column(columnName, width, columnLabel, columnProperties));
            return grid;
        }

        #endregion
    }
}
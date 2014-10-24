using System;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace JqGrid.Contrib
{
    public static class GridHelper
    {
        public static MvcHtmlString PaginationBtn(this HtmlHelper html, string grid, string @class = "")
        {

            var stringHtml = string.Format(@"<ul class='pagination {1}'>
                                                     <li  value='' class='btnHome' grid='{0}' ><span>  <i class='fa fa-fast-backward fa-lg'></i></span> </li>
                                                     <li  value='' class='btnPrev' grid='{0}'><span>  <i class='fa fa-backward fa-lg'></i></span> </li>
                                                     <li class='' ><span class='lblInfo' grid='{0}'></span></li>
                                                     <li  value='' class='btnNext' grid='{0}'><span>  <i class='fa fa-forward fa-lg'></i></span> </li>
                                                     <li  value='' class='btnEnd' grid='{0}'><span>  <i class='fa fa-fast-forward fa-lg'></i></span> </li>
                                               </ul>", grid, @class);

            return new MvcHtmlString(stringHtml);
        }

        public static TagBuilder ActionsList(string modalId, string @class = null)
        {
            var ul = new TagBuilder("ul");
            ul.AddCssClass("list-inline actions-list");
            ul.MergeAttributes(HtmlHelper.AnonymousObjectToHtmlAttributes(new
            {
                @class = @class ?? string.Empty,
                data_modal = modalId,
            }));

            return ul;
        }

        public static TagBuilder Add(this TagBuilder tag, IHtmlString actionHtml)
        {
            var tagHtml = new StringBuilder(tag.InnerHtml);
            tagHtml.Append(actionHtml);

            tag.InnerHtml = tagHtml.ToString();
            return tag;
        }

        public static IHtmlString EditAction(string url, Guid id = default(Guid),
            string callback = null, string hiddenId = "Id", string @class = null, bool viewFromServerUrl = false)
        {
            var edit = new TagBuilder("li");
            edit.AddCssClass(@class);

            var editLnk = new TagBuilder("a");
            editLnk.AddCssClass("load-modal");
            editLnk.MergeAttributes(HtmlHelper.AnonymousObjectToHtmlAttributes(new
            {
                data_action = url,
                data_id = id,
                data_callback = callback,
                data_hidden = hiddenId,

                // tooltip
                data_toggle = "tooltip",
                title = "Editar",
            }));

            if (viewFromServerUrl)
            {
                editLnk.MergeAttribute("data-viewurl", "true");
            }

            editLnk.InnerHtml = "<i class='fa fa-pencil fa-lg'></i>";

            edit.InnerHtml = editLnk.ToString();
            return MvcHtmlString.Create(edit.ToString());
        }

        public static IHtmlString DeleteAction(string url, string gridId, Guid id = default(Guid), string @class = null)
        {
            var delete = new TagBuilder("li");
            delete.AddCssClass(@class);

            var deleteLnk = new TagBuilder("a");
            deleteLnk.AddCssClass("delete");
            deleteLnk.MergeAttributes(HtmlHelper.AnonymousObjectToHtmlAttributes(new
            {
                data_action = url,
                data_grid = gridId,
                data_id = id,

                // tooltips
                data_toggle = "tooltip",
                title = "Eliminar",
            }));
            deleteLnk.InnerHtml = "<i class='fa fa-trash-o fa-lg'></i>";

            delete.InnerHtml = deleteLnk.ToString();
            return MvcHtmlString.Create(delete.ToString());
        }

        public static IHtmlString End(this TagBuilder tag)
        {
            return MvcHtmlString.Create(tag.ToString());
        }

        public static IHtmlString CreateLink(string url, string text, string callback = null, string title = "", string @class = null)
        {
            var link = new TagBuilder("a");
            if (@class != null)
            {
                link.AddCssClass(@class);
            }

            link.MergeAttributes(HtmlHelper.AnonymousObjectToHtmlAttributes(new
            {
                href = url,
                data_callback = callback,
                // tooltip
                title,
            }));

            link.InnerHtml = text;
            return MvcHtmlString.Create(link.ToString());
        }

        public static IHtmlString CreateFontAweson(string fontType, string extraClass, string title = "")
        {
            var i = new TagBuilder("i");
            i.AddCssClass(string.Format("fa {0}", fontType));

            if (extraClass != null)
            {
                i.AddCssClass(extraClass);
            }

            i.MergeAttributes(HtmlHelper.AnonymousObjectToHtmlAttributes(new { title }));
            return MvcHtmlString.Create(i.ToString());
        }
    }
}
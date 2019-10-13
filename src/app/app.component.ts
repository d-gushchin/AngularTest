import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  rowData: any;
  components: any;

  columnDefs = [
    {
      headerName: '',
      field: 'thumbnails111',
      cellRenderer: [],
      // checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,

    },
    {
      headerName: 'thumbnails',
      field: 'thumbnails',
      cellRenderer: 'thumbnailsImageRender',
      checkboxSelection: true,
      // headerCheckboxSelection: true,
      // headerCheckboxSelectionFilteredOnly: true,

    },
    {
      headerName: 'publishedAt',
      field: 'publishedAt',
      sortable: true
    },
    {
      headerName: 'title',
      field: 'title',
      sortable: true,
      cellRenderer: 'titleLinksRenderer',
    },
    {
      headerName: 'description',
      field: 'description',
      sortable: true
    }
  ];

  constructor(private http: HttpClient) {
    this.components = {
      titleLinksRenderer: this.titleLinksRenderer,
      thumbnailsImageRender: this.thumbnailsImageRender,
    };
  }

  titleLinksRenderer(params) {
    if (params.value === undefined || params.value === null) {
      return '';
    } else {
      const {videoId, title} = params.data;
      return `<a href='https://www.youtube.com/watch?v=${videoId}' target="_blank">${title}</a>`;
    }
  }

  thumbnailsImageRender(params) {
    if (params.value === undefined || params.value === null) {
      return '';
    } else {
      const {thumbnails} = params.data;
      return `<img src='${thumbnails}'>`;
    }
  }

  ngOnInit() {
    const data = this.http.get('https://www.googleapis.com/youtube/v3/search?key=AIzaSyDOfT_BO81aEZScosfTYMruJobmpjqNeEk&maxResults=' +
      '50&type=video&part=snippet&q=john');

    data.subscribe((res: any) => {
      this.rowData = res.items.map(item => {
        const {title, publishedAt, description, thumbnails} = item.snippet;
        return {
          videoId: item.id.videoId,
          title,
          thumbnails: thumbnails.default.url,
          publishedAt,
          description,
        };
      });
    });
  }

  onSelectionChanged(params) {
    console.log("test",  params.api.getSelectedRows())
  }

  getContextMenuItems(params: any) {
    console.log("params", params)
    if (params.column.colId === 'title') {
      return [
        {
          name: "Open in new tab",
          action: () => {
            window.open(`https://www.youtube.com/watch?v=${params.node.data.videoId}`, "_blank");
          }
        },
        "copy",
        "paste",
        "copyWithHeaders",
      ];
    }
    return [];
  }
}

import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ApiServicService } from '../../services/api-servic.service';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-characters',
  imports: [ReactiveFormsModule, FormsModule, PaginationModule, CommonModule],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.scss',
})
export class CharactersComponent {
  constructor(private apiService: ApiServicService) {

  }
  searchControl = new FormControl('', { nonNullable: true });
  pageControl = new FormControl(1, { nonNullable: true });

  totalItems = signal(0);
  dataList: [] = [] ;

  ngOnInit() {
    this.initApiCall(null , 0) ;
    this.onChangePagination() ;
  }

  onChangePagination() {
    this.pageControl.valueChanges.subscribe((value:number) => {
    console.log('Page changed:', value);
    this.initApiCall(null ,value);
  });
  }

  onSearch() {
    this.searchControl.valueChanges
    .pipe(
      debounceTime(300),        // wait 300ms after the last keystroke
      distinctUntilChanged()     // only emit if value actually changed
    )
    .subscribe((value: string) => {
      console.log('Search:', value);
      this.initApiCall(value, 0);
    });
  }



  initApiCall(searchQuery: string | null , pageNumber: Number) {
     this.apiService.getUsers().subscribe({
      next: (res) => {
        this.totalItems = res.results.length ;
        this.dataList = res.results ;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  // here's the task:
  // the page will initially call an api to load the character list
  // the data is paginated, so when the page is changed, you need to load the data of that page
  // when the user types anything in the search field, it also needs to search, the page needs to be resetted to 1
  // search requests should be debounced, and should cancel any previous pending request

  // the api url is:
  // https://rickandmortyapi.com/api/character
  // the search and page data needs to be send in the query params
  // it will be seomthing like this: { name: "searchedValue" or null, page: pageValue }
}

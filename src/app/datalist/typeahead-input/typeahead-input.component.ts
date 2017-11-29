import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {RuntimeService} from "../../services/runtime.service";

/**
 * Created by jayhamilton on 2/26/17.
 */

@Component({
    moduleId: module.id,
    selector: 'app-typeahead-input',
    templateUrl: './view.html',
})
export class TypeAheadInputComponent {

    @Input() searchList: string[];
    @Input() placeHolderText;
    @Output() selectionEvent = new EventEmitter<string>();
    @Output() ArtificialIntelligenceEventEmitter: EventEmitter<any> = new EventEmitter<any>();

    requestCounter = 0;
    maxAttempts = 5;

    public query = '';
    public filteredList = [];
    public elementRef;

    constructor(myElement: ElementRef, private _runtimeService: RuntimeService) {
        this.elementRef = myElement;

    }

    filter() {
        if (this.query !== '') {
            this.filteredList = this.searchList.filter(function (el) {
                return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            }.bind(this));
        } else {
            this.filteredList = [];
        }
        this.selectionEvent.emit(this.query);

        this.requestCounter++;
        if (this.requestCounter === this.maxAttempts) {

            this.processAIString(this.query);
            this.requestCounter = 0;
        }
    }

    select(item) {
        this.query = item;
        this.filteredList = [];
        this.selectionEvent.emit(item);
    }

    processAIString(aiStatement: string) {

        this._runtimeService.callWitAI(aiStatement).subscribe(data => {
            console.log(data);
            this.ArtificialIntelligenceEventEmitter.emit(data);

        });
    }
}

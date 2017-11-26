import {Component, ContentChild, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-data-list',
    moduleId: module.id,
    templateUrl: './view.html',
    styleUrls: ['./styles.css']
})
export class DataListComponent {

    @Input() objectList: any[];
    @Input() objectTitleList: string[];
    @Input() placeHolderText: string;
    @Input() layoutColumnOneWidth: string;
    @Input() layoutColumnTwoWidth: string;
    @ContentChild(TemplateRef) template: TemplateRef<any>;


    color = 'white';
    objectListCopy: any[] = [];

    filterListByTags(filterList: string[]) {

        this.copyObjectList();
        this.objectList = this.objectListCopy.filter(object => {

            let tagFound = false;

            if (!filterList.length) {
                return true;
            } else {
                object.tags.forEach(tag => {

                    filterList.forEach(filter => {

                        if (tag.name.toLocaleLowerCase() === filter.toLocaleLowerCase()) {
                            tagFound = true;
                        }
                    });
                });

                return tagFound;
            }
        });

    }

    filterListBySearchString(searchString: string) {

        this.copyObjectList();
        this.objectList = this.objectListCopy.filter(object => {

            if (searchString.localeCompare('') === 0) {
                return true;
            } else {

                if (object.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1) {

                    return true;
                }
            }

        });
    }

    /**
     * todo - find a better way to manage the list that is displayed and filtered.
     */
    copyObjectList() {
        if (this.objectListCopy.length === 0) {
            this.objectList.forEach(item => {
                this.objectListCopy.push(item);
            });
        }
    }
}


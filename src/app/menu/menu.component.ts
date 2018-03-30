import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ConfigurationService} from '../services/configuration.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MenuEventService} from './menu-service';


declare var jQuery: any;


/**a
 * Menu component
 *
 */
@Component({
    moduleId: module.id,
    selector: 'app-menu-component',
    templateUrl: './view.html',
    styleUrls: ['./styles.css'],
    animations: [

        trigger('accordion', [
            state('in', style({
                opacity: '1'
            })),
            state('out', style({
                opacity: '0'
            })),
            transition('in => out', animate('50ms ease-in-out')),
            transition('out => in', animate('100ms ease-in-out'))
        ]),
        trigger('accordion2', [
            state('in', style({
                height: '*'
            })),
            state('out', style({
                height: '0px'
            })),
            transition('in => out', animate('100ms ease-in-out')),
            transition('out => in', animate('50ms ease-in-out'))
        ])
    ]
})
export class MenuComponent implements OnInit {

    dashboardList: any[] = [];
    selectedBoard = '';
    placeHolderText = 'Ask the board to do something!';
    searchList: Array<string> = [];

    detailMenuOpen = 'out';

    @ViewChild('notificationSideBar_tag') notificationSideBarRef: ElementRef;
    @ViewChild('layoutSideBar_tag') layoutSideBarRef: ElementRef;
    @ViewChild('stickymenu_tag') stickyMenuRef: ElementRef;

    notificationSideBar: any;
    layoutSideBar: any;
    stickyMenu: any;

    typeAheadIsInMenu = true;

    layoutId = 0;

    constructor(private _configurationService: ConfigurationService,
                private _menuEventService: MenuEventService) {

        this.setupEventListeners();
    }

    setupEventListeners() {
        this._menuEventService.listenForGridEvents().subscribe((event: IEvent) => {

            const edata = event['data'];

            switch (event['name']) {
                case 'boardUpdateEvent':
                    this.updateDashboardMenu(edata);
                    break;
            }

        });
    }

    ngOnInit() {
        this.updateDashboardMenu('');
        this.stickyMenu = jQuery(this.stickyMenuRef.nativeElement);
        this.stickyMenu.sticky();
    }

    emitBoardChangeLayoutEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardChangeLayoutEvent', data: event});
    }

    emitBoardSelectEvent(event) {
        this.boardSelect(event);
        this._menuEventService.raiseMenuEvent({name: 'boardSelectEvent', data: event});
    }

    emitBoardCreateEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardCreateEvent', data: event});
        this.updateDashboardMenu(event);
    }

    emitBoardEditEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardEditEvent', data: event});
    }

    emitBoardDeleteEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardDeleteEvent', data: event});
        this.updateDashboardMenu('');
    }

    emitBoardAddGadgetEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardAddGadgetEvent', data: event});
    }

    emitBoardAIAddGadgetEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardAIAddGadgetEvent', data: event});
    }

    updateDashboardMenu(selectedBoard: string) {

        this._configurationService.getBoards().subscribe(data => {

            const me = this;
            if (data && data instanceof Array && data.length) {
                this.dashboardList.length = 0;


                // sort boards
                data.sort((a: any, b: any) => a.boardInstanceId - b.boardInstanceId);

                data.forEach(board => {

                    me.dashboardList.push(board.title);

                });

                if (selectedBoard === '') {

                    this.boardSelect(this.dashboardList[0]);

                } else {

                    this.boardSelect(selectedBoard);
                }
            }
        });
    }

    boardSelect(selectedBoard: string) {
        this.selectedBoard = selectedBoard;
    }

    toggleAccordion(): void {

        this.detailMenuOpen = this.detailMenuOpen === 'out' ? 'in' : 'out';

    }

    toggleLayoutSideBar() {
        this.layoutSideBar = jQuery(this.layoutSideBarRef.nativeElement);
        this.layoutSideBar.sidebar('setting', 'transition', 'overlay');
        this.layoutSideBar.sidebar('toggle');
        this.layoutId = this._configurationService.currentModel.id;
    }

    toggleNotificationSideBar() {
        this.notificationSideBar = jQuery(this.notificationSideBarRef.nativeElement);
        this.notificationSideBar.sidebar('setting', 'transition', 'overlay');
        this.notificationSideBar.sidebar('toggle');
    }
}

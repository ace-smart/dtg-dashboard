import {
    ChangeDetectorRef, Component
} from '@angular/core';

import {
    style, trigger, animate, transition, state
} from '@angular/animations';

import {RuntimeService} from '../../../services/runtime.service';
import {GadgetInstanceService} from '../../board/grid-manager/grid.service';
import {EndPointService} from '../../board/board-configuration/tab-endpoint/endpoint.service';
import {GadgetPropertyService} from '../_common/gadget-property.service';
import {GadgetBase} from '../_common/gadget-base';
import {DiskService} from './service';
import {TrendLineService} from '../trend-line/service';


@Component({
    selector: 'app-dynamic-component',
    moduleId: module.id,
    templateUrl: 'view.html',
    styleUrls: ['../_common/styles-gadget.css'],
    animations: [

        trigger('accordion', [
            state('in', style({
                height: '*'
            })),
            state('out', style({
                opacity: '0',
                height: '0px'
            })),
            transition('in => out', animate('700ms ease-in-out')),
            transition('out => in', animate('300ms ease-in-out'))
        ]),
        trigger('accordion2', [
            state('in', style({
                height: '*'
            })),
            state('out', style({
                opacity: '0',
                height: '0px'
            })),
            transition('in => out', animate('300ms ease-in-out')),
            transition('out => in', animate('800ms ease-in-out'))
        ])
    ]
})
export class DiskGadgetComponent extends GadgetBase {

    topic: any;

    showOperationControls = false;

    data: any;

    threshold: string;

    badColorScheme = {
        domain: ['#a10910', '#C6FFC7', '#C7B42C']
    };
    goodColorScheme = {
        domain: ['#2185D0', '#C6FFC7', '#C7B42C']
    };

    detailMenuOpen: string;

    colorScheme = this.goodColorScheme;

    constructor(protected _runtimeService: RuntimeService,
                protected _gadgetInstanceService: GadgetInstanceService,
                protected _propertyService: GadgetPropertyService,
                protected _endPointService: EndPointService,
                protected _changeDetectionRef: ChangeDetectorRef,
                protected _diskService: DiskService) {
        super(_runtimeService,
            _gadgetInstanceService,
            _propertyService,
            _endPointService,
            _changeDetectionRef);

        this.run();
        this.setTopic();
    }


    public preRun(): void {

        this.threshold = this.getPropFromPropertyPages('threshold');
        this.detailMenuOpen = 'out';

    }


    public run() {
        this.data = [];
        this.errorExists = false;
        this.actionInitiated = true;
        this.actionInitiated = false;
        this.inRun = true;
        this.updateData(null);
    }

    public stop() {
        this.errorExists = false;
        this.actionInitiated = true;
        this.actionInitiated = false;
        this.inRun = false;
    }

    public updateData(data: any[]) {

        this._diskService.getMockData().subscribe(data => {
                this.data = data;

                const thresholdVal = Number(this.threshold);

                if (this.data[0].value < thresholdVal) {
                    this.colorScheme = this.goodColorScheme;
                } else {
                    this.colorScheme = this.badColorScheme;
                }

            },
            error => this.handleError(error));
    }

    public updateProperties(updatedProperties: any) {

        /**
         * todo
         *  A similar operation exists on the procmman-config-service
         *  whenever the property page form is saved, the in memory board model
         *  is updated as well as the gadget instance properties
         *  which is what the code below does. This can be eliminated with code added to the
         *  config service or the property page service.
         *
         * **/

        const updatedPropsObject = JSON.parse(updatedProperties);

        this.propertyPages.forEach(function (propertyPage) {


            for (let x = 0; x < propertyPage.properties.length; x++) {

                for (const prop in updatedPropsObject) {
                    if (updatedPropsObject.hasOwnProperty(prop)) {
                        if (prop === propertyPage.properties[x].key) {
                            propertyPage.properties[x].value = updatedPropsObject[prop];
                        }

                    }
                }
            }
        });

        this.threshold = updatedPropsObject.threshold;
        this.title = updatedPropsObject.title;
        this.setEndPoint(updatedPropsObject.endpoint);

        this.run();


    }
    setTopic() {
        this._diskService.getHelpTopic().subscribe(data => {

            this.topic = data;
            console.log(data);

        });
    }
    toggleAcordion(): void {

        this.detailMenuOpen = this.detailMenuOpen === 'out' ? 'in' : 'out';

    }
}

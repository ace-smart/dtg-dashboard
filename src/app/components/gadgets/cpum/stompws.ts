import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/interval';




declare var System: any;
declare var SockJS: any;
declare var Stomp: any;

export class StompWebSocket {

    private startListenerProxy: () => void;
    private reconnectProxy: () => void;

    private listener: Subject<String>;

    private socketjs_lib: any;
    private stomp_lib: any;

    private client: any;
    private stomp: any;

    private socket_url: string;
    private topic: string;
    private broker: string;

    private isInit = false;

    public isInitialized(): boolean {
        return this.isInit;
    }

    public getSubject(): Subject<any> {
        return this.listener;
    }

    public send(message: any) {
        console.log('send(): ' + this.getBroker());
        this.stomp.send(this.getBroker(), { priority: 9 }, JSON.stringify(message));
    }

    public init() {
        this.listener = new Subject();
        this.startListenerProxy = () => {
            this.startListener.apply(this);
        };
        this.reconnectProxy = () => {
            this.reconnect.apply(this);
        };

        this.initializeSockets();
        // this.loadDependencies();
    }


    constructor(_url: string, _topic: string, _broker: string) {
        console.log('socket url: ' + _url);
        console.log('topic: ' + _topic);
        console.log('broker: ' + _broker);
        this.setSocketUrl(_url);
        this.setTopic(_topic);
        this.setBroker(_broker);
    }

    public getSocketUrl(): string {
        return this.socket_url;
    }

    public setSocketUrl(value: string) {
        this.socket_url = value;
    }

    public getTopic(): string {
        return this.topic;
    }

    public setTopic(value: string) {
        this.topic = value;
    }

    public getBroker(): string {
        return this.broker;
    }

    public setBroker(value: string) {
        this.broker = value;
    }

    private reconnect() {
        console.log('Reconnecting....');
        Observable.interval(30000).take(1).subscribe(
            () => {
                this.initializeSockets();
            }
        );
    }

    private startListener() {
        const _listener = this.listener;
        this.stomp.subscribe(this.getTopic(), function(data) {

            console.log(data);
            _listener.next(JSON.parse(data.body));
        });
    }

    private initializeSockets() {
        console.log('Initializing....');
        this.client = new SockJS(this.getSocketUrl());
        this.stomp = Stomp.over(this.client);
        this.stomp.connect({}, this.startListenerProxy);
        this.stomp.onclose = this.reconnectProxy;
        this.isInit = true;
    }

    /*
    private loadDependencies() {
        System.import('../lib/sockjs-0.3.4.js', module.id).then(
            refModule => {
                this.socketjs_lib = refModule;
                console.log('socketjs loaded');
                System.import('../lib/stomp.js', module.id).then(
                    refModule2 => {
                        this.stomp_lib = refModule2;
                        console.log('stomp loaded');

                        this.initializeSockets();
                    }
                );
            }
        );

    }
    */


}

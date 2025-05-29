import { FormlyFieldConfig } from "@ngx-formly/core";

export class Step1Form {
    model = {
        'vehicleType': '',
        'vehicleMake': '',
        'vehicleModel': '',
        'vehicleYear': 2015,
        'vehicleRegistration': '',
        'vehicleCondition': '',
        'vehicleLocation': '',
        'preferredDate': '',
        'vehicleMileage': 0,
        'additionalNotes': '',
    };
    fields: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'two-column-grid',
            fieldGroup: [
                {
                    key: 'vehicleMake',
                    type: 'select',
                    props: {
                        label: 'Vehicle Brand',
                        placeholder: 'Select your brand',
                        required: true,
                        options: [
                            { value: 1, label: 'Option 1' },
                            { value: 2, label: 'Option 2' },
                            { value: 3, label: 'Option 3' },
                            { value: 4, label: 'Option 4' },
                        ],
                    },
                },
                {
                    key: 'vehicleModel',
                    type: 'input',
                    props: {
                        label: 'Vehicle Model',
                        placeholder: 'Enter your vehicle model',
                        required: true,
                    }
                },
                {
                    key: 'vehicleYear',
                    type: 'input',
                    props: {
                        label: 'Vehicle Year',
                        placeholder: '2015',
                        required: true,
                        type: 'number'
                    }
                },
                {
                    key: 'vehicleCondition',
                    type: 'select',
                    props: {
                        label: 'Vehicle Condition',
                        placeholder: 'Select the vehicle condition',
                        required: true,
                        options: [
                            { value: 'running', label: 'Running' },
                            { value: 'not-running', label: 'Not Running' },
                            { value: 'damaged', label: 'Damaged' },
                            { value: 'parts-only', label: 'Parts Only' }
                        ],
                    },
                },
                {
                    key: 'vehicleRegistration',
                    type: 'input',
                    props: {
                        label: 'Vehicle Registration',
                        placeholder: 'ABCD 1234',
                        required: true,
                    }
                },
                {
                    key: 'vehicleMileage',
                    type: 'input',
                    props: {
                        label: 'Vehicle Mileage',
                        placeholder: '10000 (Km)',
                        required: true,
                        type: 'number'
                    }
                },
                {
                    key: 'vehicleLocation',
                    type: 'input',
                    props: {
                        label: 'Pickup Location',
                        placeholder: 'Enter your pickup location',
                        required: true,
                    }
                },
                {
                    key: 'preferredDate',
                    type: 'datepicker',
                    props: {
                        label: 'Preferred Collection Date',
                        placeholder: '12/8/2023',
                        required: true,
                    },
                },
                {
                    key: 'additionalNotes',
                    className: 'full-width',
                    type: 'textarea',
                    props: {
                        label: 'Additional Notes',
                        placeholder: '',
                        required: false,
                    },
                },
            ]
        }
    ];
}
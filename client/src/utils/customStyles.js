const customStyles = {
    control: (base) => ({
        ...base,
        background: '#1e293b', // bg-slate-800
        borderColor: '#334155', // border-slate-700
        '&:hover': {
            borderColor: '#3b82f6' // blue-600
        }
    }),
    menu: (base) => ({
        ...base,
        background: '#1e293b', // bg-slate-800
        border: '1px solid #334155' // border-slate-700
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused
            ? '#475569' // blue-400
            : state.isSelected
                ? '#1d4ed8' // blue-700
                : '#1e293b', // bg-slate-800
        color: '#ffffff',
        '&:active': {
            backgroundColor: '#1d4ed8' // blue-700
        },
        cursor: 'pointer'
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: '#2563eb', // blue-600
        borderRadius: '4px'
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: '#ffffff'
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: '#ffffff',
        '&:hover': {
            backgroundColor: '#1d4ed8', // blue-700
            color: '#ffffff'
        }
    }),
    input: (base) => ({
        ...base,
        color: '#ffffff',
        paddingTop: '4px',
        paddingBottom: '4px'
    }),
    placeholder: (base) => ({
        ...base,
        color: '#94a3b8', // slate-400
        fontWeight: '300', // light font weight
        fontSize: '12px'
    }),
    singleValue: (base) => ({
        ...base,
        color: '#ffffff'
    })
};

export default customStyles;
const Toggle = ({ disabled, onChange, checked }) => {
  return (
    <label className='toggle-switch'>
      <input
        type='checkbox'
        checked={!checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span className='slider' />
    </label>
  )
}

export default Toggle
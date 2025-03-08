

const Settings = () => {

  const scrollToTop = () => {
    window
      .scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  scrollToTop()
  
  return (
    <div>Settings</div>
  )
}

export default Settings
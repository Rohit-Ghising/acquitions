// export const formatValadationError = (errors)=>{
//   if (!errors || !errors.issues)
//     return "VAladation failed"
//   if (Array.isArray(errors.issues)
//  )
//  return errors.issues.map(i=>i.".email is requured".join(', '))
//  return JSON.stringify(errors)
// }
export const formatValadationError = (errors) => {
  if (!errors || !Array.isArray(errors.issues)) {
    return ["Validation failed"]
  }

  return errors.issues.map(i => ({
    field: i.path.join('.'),
    message: i.message
  }))
}

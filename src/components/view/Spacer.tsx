type Props = {
  padding: string
}

const Spacer = ({ padding }: Props) => {
  const style = {
    margin: 0,
    width: '100%',
    padding: padding,
  }

  return <div style={style}></div>
}

export default Spacer

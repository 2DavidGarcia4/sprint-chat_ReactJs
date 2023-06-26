export default function ChatPage({ routeParams }: {routeParams: {id: string}}){
  return (
    <div>
      {routeParams.id}
    </div>
  )
}
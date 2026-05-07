export async function POST(req: Request) {

  try {

    const formData = await req.formData();

    const file =
      formData.get("file") as File;

    if (!file) {

      return Response.json(
        {
          success: false,
          message: "File tidak ditemukan"
        },
        {
          status: 400
        }
      );

    }

    const forwardForm = new FormData();

    forwardForm.append("file", file);

    const response = await fetch(
      process.env.N8N_WEBHOOK_URL!,
      {
        method: "POST",
        body: forwardForm,
      }
    );

    const result =
      await response.json();

    if (!response.ok) {

      return Response.json(
        {
          success: false,
          message: "Webhook gagal",
          error: result
        },
        {
          status: 500
        }
      );

    }

    return Response.json({
      success: true,
      message: "Upload berhasil",
      data: result
    });

  } catch (error) {

    console.log(error);

    return Response.json(
      {
        success: false,
        message: "Server error"
      },
      {
        status: 500
      }
    );
  }
}
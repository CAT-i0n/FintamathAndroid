package com.fintamath.camera

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

import com.fintamath.databinding.FragmentCameraBinding
import com.fintamath.MainActivity

import android.Manifest
import android.content.pm.PackageManager
import android.graphics.Bitmap
import androidx.camera.core.ImageCapture
import androidx.core.content.ContextCompat
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import android.widget.Toast
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.core.Preview
import androidx.camera.core.CameraSelector
import android.util.Log
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.ImageProxy
import android.graphics.BitmapFactory
import androidx.camera.core.ExperimentalGetImage;

import androidx.navigation.findNavController
import com.fintamath.R
import android.util.Size
import androidx.core.view.WindowCompat.setDecorFitsSystemWindows
import androidx.core.view.WindowCompat
import android.os.Build



class CameraFragment : Fragment() {
    private lateinit var viewBinding: FragmentCameraBinding
    private lateinit var cameraExecutor: ExecutorService
    private lateinit var imageCapture: ImageCapture

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //OpenCVLoader.initDebug()
    }


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        viewBinding = FragmentCameraBinding.inflate(layoutInflater)

        viewBinding.cameraBackButton.setOnClickListener { viewBinding.root.findNavController().navigate(R.id.action_cameraFragment_to_calculatorFragment) }
        viewBinding.imageCaptureButton.setOnClickListener { takePhoto() }
        hideSystemUI()
        return viewBinding.root
    }

    private fun hideSystemUI() {
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
              val window = requireActivity().window
              window.setDecorFitsSystemWindows(false)
              WindowCompat.setDecorFitsSystemWindows(window, false)
          }
        else {
            val decorView: View = viewBinding.root
            val uiOptions = decorView.systemUiVisibility
            var newUiOptions = uiOptions
            newUiOptions = newUiOptions or View.SYSTEM_UI_FLAG_LOW_PROFILE
            newUiOptions = newUiOptions or View.SYSTEM_UI_FLAG_FULLSCREEN
            newUiOptions = newUiOptions or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            newUiOptions = newUiOptions or View.SYSTEM_UI_FLAG_IMMERSIVE
            newUiOptions = newUiOptions or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            decorView.systemUiVisibility = newUiOptions
          }


    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        if (allPermissionsGranted()) {
            startCamera()
        } else {
            requestPermissions(REQUIRED_PERMISSIONS, REQUEST_CODE_PERMISSIONS)
        }



        cameraExecutor = Executors.newSingleThreadExecutor()
    }


    override fun onRequestPermissionsResult(
        requestCode: Int, permissions: Array<String>, grantResults:
        IntArray) {
        Log.d(TAG, requestCode.toString())
        if (requestCode == REQUEST_CODE_PERMISSIONS) {
            if (allPermissionsGranted()) {
                startCamera()
            } else {
                Toast.makeText(context,
                    "Permissions not granted by the user.",
                    Toast.LENGTH_SHORT).show()
                activity?.finish()
            }
        }
    }

    private fun startCamera()  {
        val context = requireContext()
        //val previewView = PreviewView(context)

        val cameraProviderFuture = ProcessCameraProvider.getInstance(context)

        cameraProviderFuture.addListener({
            val cameraProvider: ProcessCameraProvider = cameraProviderFuture.get()

            // Preview
            val preview = Preview.Builder()
                .build()
                .also {
                    it.setSurfaceProvider(viewBinding.viewFinder.surfaceProvider)
                }

            imageCapture = ImageCapture.Builder()
                .setTargetRotation(viewBinding.viewFinder.display.rotation)
                .setTargetResolution(Size(720,1440))
                .build()

            val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

            try {
                // Unbind use cases before rebinding
                cameraProvider.unbindAll()

                // Bind use cases to camera
                cameraProvider.bindToLifecycle(
                    this, cameraSelector, preview, imageCapture)

            } catch(exc: Exception) {
                Log.e(TAG, "Use case binding failed", exc)
            }

        }, ContextCompat.getMainExecutor(context))
    }

    private fun takePhoto() {

        // Set up image capture listener, which is triggered after photo has
        // been taken
        imageCapture.takePicture(
            ContextCompat.getMainExecutor(requireContext()),
            object : ImageCapture.OnImageCapturedCallback() {
                override fun onError(exc: ImageCaptureException) {
                    Log.e(TAG, "Photo capture failed: ${exc.message}", exc)
                }

                @ExperimentalGetImage
                override fun onCaptureSuccess(imageProxy: ImageProxy){
                    val image = imageProxy.image
                    //val bitmap = Bitmap.createBitmap(image)
                    val buffer = image!!.planes[0].buffer
                    buffer.rewind()
                    val bytes = ByteArray(buffer.capacity())
                    buffer.get(bytes)
                    val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
                    val location = IntArray(2)
                    viewBinding.focusExpr.getLocationOnScreen(location)
                    (activity as MainActivity).set_full_image(bitmap)
                    Log.d(TAG, image.width.toString()+" " +image.height.toString())
                    Log.d(TAG, bitmap.width.toString()+" " +bitmap.height.toString())
                    Log.d(TAG, viewBinding.mainLayout.width.toString()+" " +viewBinding.mainLayout.height.toString())
                    val cut = Bitmap.createBitmap(bitmap, location[0], location[1], viewBinding.focusExpr.getWidth(), viewBinding.focusExpr.getHeight())
                    (activity as MainActivity).set_cut_image(cut)
                    imageProxy.close()
                    viewBinding.root.findNavController().navigate(R.id.action_cameraFragment_to_recFragment)


                }
            }
        )
    }


    private fun allPermissionsGranted() = REQUIRED_PERMISSIONS.all {
        ContextCompat.checkSelfPermission(
            requireContext(), it) == PackageManager.PERMISSION_GRANTED
    }

    override fun onDestroy() {
        super.onDestroy()
        cameraExecutor.shutdown()
    }

    companion object {
        private const val TAG = "Fintamath"
        private const val REQUEST_CODE_PERMISSIONS = 10
        private val REQUIRED_PERMISSIONS =
            mutableListOf (
                Manifest.permission.CAMERA,
            ).toTypedArray()
    }

    private fun executeBack() {
        activity?.onBackPressedDispatcher?.onBackPressed()
    }
}


